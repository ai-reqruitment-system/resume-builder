import React, { useState, useEffect } from 'react';

const MonthYearSelector = ({ value, onChange, label, placeholder = "Select date", required = false }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Parse initial value on mount
    useEffect(() => {
        if (value) {
            const parts = value.split(' ');
            if (parts.length === 2) {
                setMonth(parts[0]);
                setYear(parts[1]);
            }
        }
    }, []);

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const years = Array.from({ length: 50 }, (_, i) =>
        new Date().getFullYear() - i
    ).reverse();

    const handleChange = (newMonth, newYear) => {
        if (newMonth && newYear) {
            onChange(`${newMonth} ${newYear}`);
        } else {
            onChange('');
        }
    };

    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
                <select
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        handleChange(e.target.value, year);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">{placeholder}</option>
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        handleChange(month, e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">{placeholder}</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MonthYearSelector;