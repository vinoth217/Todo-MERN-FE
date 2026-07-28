import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useAppDispatch } from '../store'
import { login } from '../store/slice/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {isLoading, user} = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      // unwrap() throws on reject so catch can handle API errors
      await dispatch(login({ email, password })).unwrap()
      navigate('/')
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Login failed')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
            <div>
                <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Login to your account</h2>
            </div>
            <form className='mt-8 space-y-6' onSubmit={handleLogin} action="" method="POST">
                {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
                <div>
                    <input type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm' required />
                </div>
                <div>
                    <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm' required />
                </div>
                <div>
                    <button type="submit" className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                </div>
            </form>
            <p className='text-center text-sm text-gray-500'>Don't have an account? <Link to="/register" className='text-indigo-600 hover:text-indigo-700'>Register</Link></p>
        </div>
    </div>
  )
}

export default Login