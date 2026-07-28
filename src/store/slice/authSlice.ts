import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from 'axios'

interface User {
    _id: string
    name: string
    email: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
}

interface AuthError {
    message: string
}

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    isLoading: false,
    error: null,
}

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<AuthError>
    return axiosError.response?.data?.message || fallback
}

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email, password }, { withCredentials: true })
            const user = { _id: data._id, name: data.name, email: data.email }
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', data.token)
            return user
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Login failed'))
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }: { name: string, email: string, password: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, { name, email, password }, { withCredentials: true })
            const user = { _id: data._id, name: data.name, email: data.email }
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', data.token)
            return user
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Registration failed'))
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        return null
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ name, currentPassword, newPassword }: { name: string, currentPassword: string, newPassword: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, { name, currentPassword, newPassword }, { withCredentials: true })
            const user = { _id: data._id, name: data.name, email: data.email }
            localStorage.setItem('user', JSON.stringify(user))
            return user
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Profile update failed'))
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
            state.error = null
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.error = (action.payload as string) || action.error.message || 'An error occurred'
        })
        .addCase(register.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
            state.error = null
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.error = (action.payload as string) || action.error.message || 'An error occurred'
        })
        .addCase(logout.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.isLoading = false
            state.user = null
            state.error = null
        })
        .addCase(logout.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'An error occurred'
        })
        .addCase(updateProfile.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
            state.error = null
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.isLoading = false
            state.error = (action.payload as string) || action.error.message || 'An error occurred'
        })
    }
})

export default authSlice.reducer
