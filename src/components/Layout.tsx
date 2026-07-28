import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {type RootState} from '../store';
import Navbar from './Navbar';

const Layout = () => {
    const {isDarkMode} = useSelector((state: RootState) => state.theme);

    return (
        <div className={`min-h-screen transition-colors ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
