import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setGlobalLoading, setComponentLoading } from '@/store/slices/uiSlice';

// Create the context
const LoadingContext = createContext();

/**
 * LoadingProvider - A provider component that manages loading states throughout the application
 * This integrates with the existing Redux store while providing a more convenient API
 */
export function LoadingProvider({ children }) {
    const dispatch = useDispatch();
    const [loadingStates, setLoadingStates] = useState({});

    // Set global loading state (full-screen overlay)
    const setGlobalLoadingState = useCallback((isLoading, message = 'Loading...') => {
        dispatch(setGlobalLoading({ isLoading, loadingMessage: message }));
    }, [dispatch]);

    // Set component-specific loading state
    const setComponentLoadingState = useCallback((component, isLoading) => {
        dispatch(setComponentLoading({ component, isLoading }));
        setLoadingStates(prev => ({
            ...prev,
            [component]: isLoading
        }));
    }, [dispatch]);

    // Utility function to wrap async operations with loading states
    const withLoading = useCallback(async (operation, options = {}) => {
        const {
            component, // Component-specific loading (e.g., 'profile', 'builder')
            global = false, // Whether to show global loading overlay
            message = 'Loading...', // Message to display during loading
            errorHandler = null // Optional error handler function
        } = options;

        try {
            // Set loading state
            if (global) {
                setGlobalLoadingState(true, message);
            }
            if (component) {
                setComponentLoadingState(component, true);
            }

            // Execute the operation
            const result = await operation();
            return result;
        } catch (error) {
            console.error('Operation failed:', error);
            if (errorHandler) {
                errorHandler(error);
            }
            throw error;
        } finally {
            // Reset loading state
            if (global) {
                setGlobalLoadingState(false);
            }
            if (component) {
                setComponentLoadingState(component, false);
            }
        }
    }, [setGlobalLoadingState, setComponentLoadingState]);

    // Check if a specific component is loading
    const isComponentLoading = useCallback((component) => {
        return !!loadingStates[component];
    }, [loadingStates]);

    const value = {
        setGlobalLoading: setGlobalLoadingState,
        setComponentLoading: setComponentLoadingState,
        withLoading,
        isComponentLoading
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}

// Custom hook to use the loading context
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};