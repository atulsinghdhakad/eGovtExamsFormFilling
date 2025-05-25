import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore, storage } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [isEditing, setIsEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [newPhotoFile, setNewPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [activityLog, setActivityLog] = useState([]);
    const [loadingSave, setLoadingSave] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Detect online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch user profile data and activity log from Firestore
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (isOffline) {
            setErrorMessage('You are offline. Profile data may be outdated.');
            return;
        }

        setErrorMessage('');
        const docRef = doc(firestore, 'users', user.uid);

        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTwoFAEnabled(data.twoFAEnabled || false);
                    setActivityLog(data.activityLog || []);
                }
            })
            .catch((error) => {
                if (error.code === 'unavailable') {
                    setErrorMessage('Firestore is currently unavailable.');
                    setTwoFAEnabled(false);
                    setActivityLog([]);
                } else {
                    console.error('Error fetching user document:', error);
                    setErrorMessage('Failed to load profile data.');
                }
            });

        // Update activity log on page load
        updateDoc(docRef, {
            activityLog: arrayUnion(new Date().toISOString()),
        }).catch((err) => {
            if (err.code === 'unavailable') {
                console.warn('Failed to update activity log: Firestore unavailable.');
            } else {
                // If doc does not exist, create it
                setDoc(docRef, {
                    twoFAEnabled: false,
                    activityLog: [new Date().toISOString()],
                });
            }
        });
    }, [user, isOffline, navigate]);

    // Update photo preview when file selected
    useEffect(() => {
        if (newPhotoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(newPhotoFile);
        } else {
            setPhotoPreview(null);
        }
    }, [newPhotoFile]);

    const handleEditToggle = () => {
        setIsEditing(true);
        setNewDisplayName(displayName);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewPhotoFile(null);
        setPhotoPreview(null);
        setErrorMessage('');
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setNewPhotoFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setLoadingSave(true);
        setErrorMessage('');

        try {
            let updatedPhotoURL = photoURL;

            if (newPhotoFile) {
                const photoRef = ref(storage, `profilePhotos/${user.uid}/${newPhotoFile.name}`);
                await uploadBytes(photoRef, newPhotoFile);
                updatedPhotoURL = await getDownloadURL(photoRef);
            }

            // Update Firebase Auth profile
            await updateProfile(user, {
                displayName: newDisplayName,
                photoURL: updatedPhotoURL,
            });

            // Update Firestore user doc
            const docRef = doc(firestore, 'users', user.uid);
            await updateDoc(docRef, {
                displayName: newDisplayName,
                photoURL: updatedPhotoURL,
            });

            setDisplayName(newDisplayName);
            setPhotoURL(updatedPhotoURL);
            setIsEditing(false);
            setNewPhotoFile(null);
            setPhotoPreview(null);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        } finally {
            setLoadingSave(false);
        }
    };

    const handleTwoFAToggle = async () => {
        if (isOffline) {
            setErrorMessage('Cannot change 2FA setting while offline.');
            return;
        }
        const newValue = !twoFAEnabled;
        setTwoFAEnabled(newValue);
        const docRef = doc(firestore, 'users', user.uid);
        try {
            await updateDoc(docRef, {
                twoFAEnabled: newValue,
            });
        } catch (error) {
            setErrorMessage('Failed to update 2FA setting.');
            setTwoFAEnabled(!newValue); // revert toggle
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full transition-all duration-300">
                {isOffline && (
                    <div className="mb-4 p-3 bg-yellow-200 text-yellow-900 rounded text-center font-semibold">
                        You are currently offline. Some features may not work properly.
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 text-red-600 font-semibold text-center">{errorMessage}</div>
                )}

                <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={photoPreview || photoURL || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="mt-3"
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-indigo-500"
                        />
                    ) : (
                        <p>{displayName || 'No name set'}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Email:</label>
                    <p>{email}</p>
                </div>

                <div className="mb-6 flex items-center space-x-3">
                    <label htmlFor="twofa" className="font-semibold">
                        Two-Factor Authentication (2FA):
                    </label>
                    <input
                        type="checkbox"
                        id="twofa"
                        checked={twoFAEnabled}
                        onChange={handleTwoFAToggle}
                        disabled={isOffline}
                        className="w-5 h-5 cursor-pointer"
                    />
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Activity Log:</h3>
                    {activityLog.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
                    ) : (
                        <ul className="list-disc list-inside max-h-48 overflow-y-auto text-sm">
                            {activityLog
                                .slice()
                                .reverse()
                                .map((log, i) => (
                                    <li key={i}>{new Date(log).toLocaleString()}</li>
                                ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-between">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={loadingSave}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-4 py-2 rounded"
                            >
                                {loadingSave ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loadingSave}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEditToggle}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
