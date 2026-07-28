import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/profile'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />} >
          <Route
          index 
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
