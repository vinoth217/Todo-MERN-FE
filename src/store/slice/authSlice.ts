import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

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

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    isLoading: false,
    error: null,
}

export const login = createAsyncThunk(
    'auth/login', 
        async ({ email, password }: { email: string, password: string }) => {
            const {data} = await axios.post('http://localhost:3000/api/auth/login', { email, password }, { withCredentials: true })
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)
            return data
    }
)


export const register = createAsyncThunk(
    'auth/register', 
    async ({ name, email, password }: { name: string, email: string, password: string }) => {
        const {data} = await axios.post('http://localhost:3000/api/auth/register', { name, email, password }, { withCredentials: true })
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        return data
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
    async ({ name, currentPassword, newPassword }: { name: string, currentPassword: string, newPassword: string }) => {
        const {data} = await axios.put('http://localhost:3000/api/auth/updateProfile', { name, currentPassword, newPassword }, { withCredentials: true })
        localStorage.setItem('user', JSON.stringify(data.user))
        return data
    })

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
            state.error = action.error.message || 'An error occurred'
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
            state.error = action.error.message || 'An error occurred'
        })
        .addCase(logout.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(logout.fulfilled, (state, action) => {
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
            state.error = action.error.message || 'An error occurred'
        })
    }   
})

export default authSlice.reducer