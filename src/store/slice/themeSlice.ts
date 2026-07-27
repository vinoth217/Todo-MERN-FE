import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
    isDarkMode: boolean
}

const initialState: ThemeState = {
    isDarkMode: localStorage.getItem('theme') === 'dark' ? true : false
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        }
    }
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer