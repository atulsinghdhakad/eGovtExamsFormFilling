import React from 'react';

const Sidebar = ({ activePage, onChangePage }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'forms', label: 'Forms' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen p-4">
            <nav className="space-y-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChangePage(item.id)}
                        className={`block w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${activePage === item.id ? 'bg-gray-300 dark:bg-gray-700' : ''
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
