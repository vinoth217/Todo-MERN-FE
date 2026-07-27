import React from 'react'
// import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(email, password)
    // try {
    //   const response = await axios.post('http://localhost:3000/api/login', { email, password })
    //   console.log(response)
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    <div className='flex items-center justify-center min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
            <div>
                <h2 className='text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Login to your account</h2>
            </div>
            <form className='mt-8 space-y-6' onSubmit={handleLogin} action="" method="POST">
                <div>
                    <input type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm' required />
                </div>
                <div>
                    <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm' required />
                </div>
                <div>
                    <button type="submit" className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login