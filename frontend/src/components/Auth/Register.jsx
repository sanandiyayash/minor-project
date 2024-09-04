import React, { useState } from 'react'
import { register } from '../../api'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register(formData);
            if (data.created === false) { // Compare with boolean false instead of string 'false'
                toast.error(data.message || "Registration failed");
            } else {
                localStorage.setItem('token', data.token)
                toast.success(data.message || "Registration successful");
                navigate('/', { state: { loginSuccess: `welcome ${data.user.name}` } }); // 
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
                    <h2 className='login-heading'>Register</h2>
                    <label htmlFor="name" className='label'>Name</label>
                    <input
                        type="text"
                        name='name'
                        id='name'
                        placeholder='Enter your name...'
                        value={formData.name}
                        onChange={handleChange}
                        className='input'
                    />
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
                    <div className="text-sm text-gray-600 text-right">
                        Already registered? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
                    </div>

                    <button type='submit' className='login-button'>Submit</button>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default Register