import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useAppDispatch } from '../store'
import { register } from '../store/slice/authSlice'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const {isLoading} = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordError('');
    if(password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      return;
    }
    try {
      await dispatch(register({ name, email, password })).unwrap()
      navigate('/')
    } catch (error) {
      setPasswordError(typeof error === 'string' ? error : 'Registration failed')
    }
  }

  return (
  <div className='flex items-center justify-center min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
    <div className='max-w-md w-full space-y-8'>
        <div>
            <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Create an account</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit} action="" method="POST">
            {passwordError && <p className='text-red-500 text-sm'>{passwordError}</p>}
            <div>
                <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                required
                />
            </div>
            <div>
                <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                required
                />
            </div>
            <div>
                <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                required
                />
            </div>
            <div>
                <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                required
                />
            </div>
            <div>
                <button
                type="submit"
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </div>
            <div className='text-center text-sm text-gray-500'>
                Already have an account? <Link to="/login" className='font-medium text-indigo-600 hover:text-indigo-500'>Login</Link>
            </div>
        </form>
    </div>
  </div>
  );
};

export default Register;