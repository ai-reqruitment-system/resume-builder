import { useState, useEffect } from 'react';

/**
 * A custom hook that returns whether a media query matches the current viewport
 * @param {string} query - The media query to check
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
    // Initialize with null to avoid hydration mismatch
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;

        // Create a media query list
        const media = window.matchMedia(query);

        // Set the initial value
        setMatches(media.matches);

        // Define the listener function
        const listener = (event) => {
            setMatches(event.matches);
        };

        // Add the listener
        media.addEventListener('change', listener);

        // Clean up
        return () => {
            media.removeEventListener('change', listener);
        };
    }, [query]); // Re-run if the query changes

    return matches;
}