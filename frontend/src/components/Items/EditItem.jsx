import React, { useState, useEffect } from 'react'
import { deleteitem, editItemDetail, updataEditItem } from '../../api'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
const EditItem = () => {
    const navigate = useNavigate()
    const { itemId } = useParams()
    const [formData, setFormData] = useState({
        itemName: '',
        price: ''
    });
    const token = localStorage.getItem('token');

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    useEffect(() => {
        const fetchSingleItem = async () => {
            try {
                const res = await editItemDetail(token, itemId)
                setFormData(res.data.item)


            } catch (error) {
                console.log(error);

            }
        };

        fetchSingleItem();
    }, [itemId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await updataEditItem(token, itemId, formData);
            setFormData(res.data.item)

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

    const handleDelete = async () => {
        try {
            const res = await deleteitem(token, itemId);
            if (res.data.success) {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/item')
                }, 1500);
            }
        } catch (error) {
            toast.error(error.response.data.message || error.message)
            console.log(error);

        }
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add your Item here</h1>
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
                <input
                    type="text"
                    placeholder="Enter your item name"
                    name='itemName'
                    value={formData.itemName}
                    onChange={handleInput}
                    className="w-full p-2 border border-gray-300 rounded rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Item price"
                    name='price'
                    value={formData.price}
                    onChange={handleInput}
                    className="w-full p-2 border border-gray-300 rounded rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className='flex justify-between'>
                    <button
                        type='submit'
                        className="w-1/4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-1/4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete item
                    </button>
                </div>
            </form>


            <ToastContainer />
        </>
    )

}

export default EditItem