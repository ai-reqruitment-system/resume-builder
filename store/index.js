import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import uiReducer from './slices/uiSlice';
import templateReducer from './slices/templateSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        resume: resumeReducer,
        ui: uiReducer,
        template: templateReducer,
        auth: authReducer,
    },
});