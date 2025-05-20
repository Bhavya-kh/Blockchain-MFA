// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 shadow-lg fixed w-full top-0 left-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300">
                    Blockchain MFA
                </Link>
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="text-gray-300 hover:text-white text-lg transition duration-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className="text-gray-300 hover:text-white text-lg transition duration-300">
                            Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;