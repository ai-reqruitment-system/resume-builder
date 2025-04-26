import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentSection: 'personal',
    currentSectionIndex: 0,
    isModalOpen: false,
    showDownloadSection: false,
    isMobileMenuOpen: false,
    isSidebarOpen: true,
    activeTab: 'styles',
    isHovered: false,
    // Loading states for different parts of the application
    isLoading: false,
    loadingMessage: 'Loading...',
    componentLoading: {
        builder: false,
        resumeList: false,
        jobs: false,
        profile: false,
        formSubmission: false
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setCurrentSection: (state, action) => {
            state.currentSection = action.payload;
        },
        setCurrentSectionIndex: (state, action) => {
            state.currentSectionIndex = action.payload;
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },
        setShowDownloadSection: (state, action) => {
            state.showDownloadSection = action.payload;
        },
        setIsMobileMenuOpen: (state, action) => {
            state.isMobileMenuOpen = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },
        setIsSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setIsHovered: (state, action) => {
            state.isHovered = action.payload;
        },
        // Loading state reducers
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state, action) => {
            state.loadingMessage = action.payload;
        },
        setComponentLoading: (state, action) => {
            const { component, isLoading } = action.payload;
            state.componentLoading[component] = isLoading;
        },
        setGlobalLoading: (state, action) => {
            const { isLoading, loadingMessage } = action.payload;
            state.isLoading = isLoading;
            if (loadingMessage) state.loadingMessage = loadingMessage;
        },
        startLoading: (state, action) => {
            state.isLoading = true;
            if (action.payload) state.loadingMessage = action.payload;
        },
        stopLoading: (state) => {
            state.isLoading = false;
            state.loadingMessage = 'Loading...';
        },
    },
});

export const {
    setCurrentSection,
    setCurrentSectionIndex,
    setIsModalOpen,
    setShowDownloadSection,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    setIsSidebarOpen,
    toggleSidebar,
    setActiveTab,
    setIsHovered,
    // Loading state actions
    setIsLoading,
    setLoadingMessage,
    setComponentLoading,
    setGlobalLoading,
    startLoading,
    stopLoading
} = uiSlice.actions;

export default uiSlice.reducer;