import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sun, Moon, LogOut, User, CheckSquare } from 'lucide-react';
import { toggleTheme } from '../store/slice/themeSlice';
import { logout } from '../store/slice/authSlice';
import { useAppDispatch, type RootState } from '../store';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isDarkMode } = useSelector((state: RootState) => state.theme);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout()).unwrap().then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error('Logout failed:', error);
        });
    };

    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${
            isDarkMode
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/90 border-gray-200'
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                    >
                        <CheckSquare className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        <span className={`text-xl font-bold tracking-tight ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Task Manager
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`p-2 rounded-lg transition-colors ${
                                isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-amber-500'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                                        isDarkMode
                                            ? 'text-gray-300 hover:bg-gray-800'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        isDarkMode
                                            ? 'text-red-400 hover:bg-red-500/10'
                                            : 'text-red-500 hover:bg-red-50'
                                    }`}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
