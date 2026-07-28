import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, type RootState } from '../store'
import { updateProfile } from '../store/slice/authSlice'

const Profile = () => {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const { isDarkMode } = useSelector((state: RootState) => state.theme);
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage('New password and confirm password do not match');
            return;
        }

        try {
            await dispatch(updateProfile({ name, currentPassword, newPassword })).unwrap();
            setIsError(false);
            setMessage('Profile updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setIsError(true);
            setMessage(typeof error === 'string' ? error : 'Failed to update profile');
        }
    };

    const inputClass = `w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }`;

    const labelClass = `block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Settings
                </h1>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Update your name and password
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className={`p-6 rounded-xl border space-y-5 ${
                    isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200 shadow-sm'
                }`}
            >
                {message && (
                    <p className={`text-sm px-3 py-2 rounded-lg ${
                        isError
                            ? isDarkMode
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-red-50 text-red-600'
                            : isDarkMode
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-green-50 text-green-600'
                    }`}>
                        {message}
                    </p>
                )}

                <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className={labelClass}>New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
