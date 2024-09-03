import React from 'react'
import { useNavigate } from 'react-router-dom'
// import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
import { logout } from '../../api'
const Logout = () => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await logout()

            localStorage.removeItem('token')
            navigate('/login', { state: { logoutSuccess: "Successfully logged out" } });
        } catch (error) {
            toast.error("An error occurred during logout");
            console.error("Logout error:", error);
        }
    }
    return (
        <>
            <button
                onClick={handleLogout}
                className=" navlink flex w-full  items-center py-3 px-6 text-lg bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300"
            >
                <div><i className="fa-solid fa-right-from-bracket mr-2"></i></div> Logout
            </button>

        </>
    )
}

export default Logout