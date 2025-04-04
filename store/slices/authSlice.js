import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: true,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Clear local storage items related to auth
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                localStorage.removeItem('profileData');
            }
        },
    },
});

export const { setUser, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;