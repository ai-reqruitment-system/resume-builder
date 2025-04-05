import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentSection: 'personal',
    currentSectionIndex: 0,
    isModalOpen: false,
    showDownloadSection: false,
    isMobileMenuOpen: false,
    isSidebarOpen: true,
    isRightSidebarOpen: true,
    activeTab: 'styles',
    isHovered: false,
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
        setIsRightSidebarOpen: (state, action) => {
            state.isRightSidebarOpen = action.payload;
            // When right sidebar is open, close the left sidebar
            if (action.payload === true) {
                state.isSidebarOpen = false;
            } else {
                state.isSidebarOpen = true;
            }
        },
        toggleRightSidebar: (state) => {
            state.isRightSidebarOpen = !state.isRightSidebarOpen;
            // Toggle left sidebar in opposite direction
            state.isSidebarOpen = !state.isRightSidebarOpen;
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
    setIsRightSidebarOpen,
    toggleRightSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;