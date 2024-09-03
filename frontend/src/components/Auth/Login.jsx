import React, { useEffect, useState } from 'react'
import { login } from '../../api'
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (location.state && location.state.logoutSuccess) {
            toast.success('Logged out successfully')
            navigate(location.pathname, { replace: true, state: {} })
        }
        if (location.state && location.state.authorized) {
            toast.error(location.state.authorized)
            navigate(location.pathname, { replace: true, state: {} })
        }
    }, [])
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            if (data.status === false) {
                toast.error(data.message || "Login failed");

            } else {
                localStorage.setItem("token", data.token)

                navigate('/', { state: { loginSuccess: `welcome ${data.user.name}` } });

            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
        }



    }
    return (
        <>
            <div className='login-container'>
                <h1 className='login-welcome'>Welcome</h1>
                <form onSubmit={handleSubmit} className='login-form' >
                    <h2 className='login-heading'>Login</h2>

                    <label htmlFor="email" className='label'>Email</label>
                    <input
                        type="email"
                        name='email'
                        id='email'
                        placeholder='Enter your email...'
                        value={formData.email}
                        onChange={handleChange}
                        className='input'
                    />
                    <label htmlFor="password" className='label'>Password</label>
                    <div className='login-password'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            id='password'
                            placeholder='Enter your password...'
                            value={formData.password}
                            onChange={handleChange}
                            className='input' />
                        <i className={`${showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}`} onClick={togglePasswordVisibility} />
                    </div>
                    <button type='submit' className='login-button'>Submit</button>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login