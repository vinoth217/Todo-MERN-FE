import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import taskReducer from './slice/taskSlice';
import themeReducer from './slice/themeSlice';
import {useDispatch} from 'react-redux';

const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        theme: themeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store