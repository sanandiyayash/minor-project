import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logout from '../Auth/Logout';

const LeftSideSection = () => {
    const location = useLocation()
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const updateToken = () => {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
        };

        updateToken();

        window.addEventListener('storage', updateToken);

        return () => {
            window.removeEventListener('storage', updateToken);
        };
    }, [location.pathname]);

    return (
        <div className="left-section bg-gray-900 text-white flex flex-col items-center p-6 w-full h-screen space-y-8">
            <div className="logo mb-4">
                <Link to="/p" className="text-purple-400 text-3xl font-bold">
                    logo
                </Link>
            </div>
            <div className="navLinks w-full flex flex-col space-y-4">
                {!token ? (
                    <>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink py-3 px-6 text-center rounded-lg transition duration-300 ${isActive ? 'bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-700'
                                }`
                            }
                            to="/login"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink py-3 px-6 text-center rounded-lg transition duration-300 ${isActive ? 'bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-700'
                                }`
                            }
                            to="/register"
                        >
                            Register
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink flex items-center py-3 px-6 text-lg rounded-lg transition duration-300 ${isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                }`
                            }
                            to="/"
                        >
                            <i className="fa-solid fa-money-check-dollar mr-3"></i>
                            <span>Invoice</span>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink flex items-center py-3 px-6 text-lg rounded-lg transition duration-300 ${isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                }`
                            }
                            to="/invoice/new"
                        >
                            <i className="fa-solid fa-money-check-dollar mr-3"></i>
                            <span>Invoice Form</span>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink flex items-center py-3 px-6 text-lg rounded-lg transition duration-300 ${isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                }`
                            }
                            to="/item/new"
                        >
                            <i className="fa-solid fa-basket-shopping mr-3"></i>
                            <span>Add Item</span>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `navlink flex items-center py-3 px-6 text-lg rounded-lg transition duration-300 ${isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                }`
                            }
                            to="/item"
                        >
                            <i className="fa-solid fa-basket-shopping mr-3"></i>
                            <span>Items</span>
                        </NavLink>

                        <div className="mt-8">
                            <Logout onLogout={() => setToken(null)} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );


};

export default LeftSideSection;
