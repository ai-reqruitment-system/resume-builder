import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastTypes } from './Toast';

// Create context
const ToastContext = createContext(null);

// Custom hook to use the toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Add a new toast
    const addToast = useCallback((message, type = ToastTypes.INFO, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
        return id; // Return id so it can be used to dismiss the toast programmatically
    }, []);

    // Remove a toast by id
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    // Convenience methods for different toast types
    const success = useCallback((message, duration) => {
        return addToast(message, ToastTypes.SUCCESS, duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, ToastTypes.ERROR, duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, ToastTypes.INFO, duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, ToastTypes.WARNING, duration);
    }, [addToast]);

    // Context value
    const value = {
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Render all active toasts */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                    position="bottom-right" // Default position
                />
            ))}
        </ToastContext.Provider>
    );
};