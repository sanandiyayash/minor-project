import React, { useState } from 'react'
import { addItem } from '../../api'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
const AddItems = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        itemName: '',
        price: ''
    })
    const token = localStorage.getItem('token')
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await addItem(token, formData);
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/item')
                }, 1500);
            }

        } catch (error) {
            toast.error(error.response.data.message || error.message)

        }
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add your Item here</h1>
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
                <input
                    type="text"
                    placeholder="Enter your item name"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Item price"
                    name="price"
                    value={formData.price}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>

            <ToastContainer />
        </>
    )
}

export default AddItems