import React from 'react';

const WidgetCard = ({ title, count, color = 'text-blue-500' }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className={`text-3xl mt-2 font-bold ${color}`}>{count}</p>
        </div>
    );
};

export default WidgetCard;
