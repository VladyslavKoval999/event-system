import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: { mode: localStorage.getItem('app_theme') || 'light' },
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('app_theme', state.mode);
        }
    }
});
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;