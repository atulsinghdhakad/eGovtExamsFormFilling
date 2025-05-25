import React from "react";

const Dashboard = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded shadow">📋 Upcoming Exams</div>
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow">📁 Documents</div>
                <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow">🔔 Notifications</div>
            </div>
        </div>
    );
};

export default Dashboard;
