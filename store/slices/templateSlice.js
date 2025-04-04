import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTemplate: 'modern',
    fontStyles: {
        font_family: "sans-serif",
        font_color: "#000000",
        is_font_bold: false,
        is_font_italic: false
    },
};

export const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setSelectedTemplate: (state, action) => {
            state.selectedTemplate = action.payload;
        },
        setFontStyles: (state, action) => {
            state.fontStyles = action.payload;
        },
        updateFontStyle: (state, action) => {
            state.fontStyles = {
                ...state.fontStyles,
                ...action.payload
            };
        },
    },
});

export const { setSelectedTemplate, setFontStyles, updateFontStyle } = templateSlice.actions;

export default templateSlice.reducer;