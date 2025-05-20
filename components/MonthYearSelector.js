import React, { useState, useEffect } from 'react';

const MonthYearSelector = ({ value, onChange, label, placeholder = "Select month", required = false, className = "" }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Parse initial value on mount and when value changes
    useEffect(() => {
        if (value) {
            const parts = value.split(' ');
            if (parts.length === 2) {
                setMonth(parts[0]);
                setYear(parts[1]);
            }
        } else {
            setMonth('');
            setYear('');
        }
    }, [value]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
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
            <label className="mb-1 text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                <select
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        handleChange(e.target.value, year);
                    }}
                    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                        bg-white appearance-none cursor-pointer truncate
                        focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
                        hover:border-teal-400 transition-colors ${className}`}
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"gray\"/></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
                >
                    <option value="" className="text-gray-500">{placeholder}</option>
                    {months.map((m) => (
                        <option key={m} value={m} className="py-1">
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
                    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                        bg-white appearance-none cursor-pointer truncate
                        focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
                        hover:border-teal-400 transition-colors ${className}`}
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"gray\"/></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
                >
                    <option value="" className="text-gray-500">Select year</option>
                    {years.map((y) => (
                        <option key={y} value={y} className="py-1">
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MonthYearSelector;