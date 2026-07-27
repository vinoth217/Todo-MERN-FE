import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface Task {
    _id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'completed';
    dueDate: string
}

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    isLoading: false,
    error: null,
}

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async () => {
        const {data} = await axios.get('http://localhost:3000/api/tasks', { withCredentials: true });
        return data;
    }
)

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (task: Task) => {
        const {data} = await axios.post('http://localhost:3000/api/tasks', task, { withCredentials: true });
        return data;
    }
)

export const updateTask = createAsyncThunk( 
    'tasks/updateTask',
    async ({ id, task }: { id: string, task: Task }) => {
        const {data} = await axios.put(`http://localhost:3000/api/tasks/${id}`, task, { withCredentials: true });
        return data;
    }
)

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string) => {
        const {data} = await axios.delete(`http://localhost:3000/api/tasks/${id}`, { withCredentials: true });
        return data;
    }
)

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTasks.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
            state.isLoading = false
            state.tasks = action.payload
            state.error = null
        })
        .addCase(fetchTasks.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'An error occurred'
        })
        .addCase(createTask.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(createTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.tasks.push(action.payload)
            state.error = null
        })
        .addCase(createTask.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'An error occurred'
        })
        .addCase(updateTask.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.tasks = state.tasks.map(task => task._id === action.payload._id ? action.payload : task)
            state.error = null
        })
        .addCase(updateTask.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'An error occurred'
        })
        .addCase(deleteTask.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.tasks = state.tasks.filter(task => task._id !== action.payload._id)
            state.error = null
        })
        .addCase(deleteTask.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'An error occurred'
        })
    }
})

export default taskSlice.reducer