import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllitems } from '../../api'
import { ToastContainer, toast } from "react-toastify";

const InvoiceForm = () => {

    const [formData, setFormData] = useState({
        billNo: "",
        billDate: "",
        customerName: "",
        billDueDate: "",
        items: [
            {
                itemName: "",
                quantity: '',
                unit: "",
                rate: '',
                amount: '',
            },
        ],
        cgst: "",
        sgst: "",
        total: "",
    });

    const [allItem, setAllitem] = useState([])
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];

        if (name === 'itemName') {
            const selectedItem = allItem.find(item => item.itemName === value);
            const rate = selectedItem ? selectedItem.price : 0;

            newItems[index] = {
                ...newItems[index],
                itemName: value,
                rate: rate,
                amount: newItems[index].quantity && rate ? newItems[index].quantity * rate : 0,
            };
        } else {
            newItems[index] = {
                ...newItems[index],
                [name]: value,
            };

            if (name === 'quantity' || name === 'rate') {
                const quantity = name === 'quantity' ? value : newItems[index].quantity;
                const rate = name === 'rate' ? value : newItems[index].rate;
                newItems[index].amount = quantity && rate ? quantity * rate : 0;
            }
        }

        // Calculate total amounts
        const totalAmount = newItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const cgstRate = 0.09;
        const sgstRate = 0.09;
        const cgst = totalAmount * cgstRate;
        const sgst = totalAmount * sgstRate;
        const total = totalAmount + cgst + sgst;

        setFormData({
            ...formData,
            items: newItems,
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: total.toFixed(2),
        });
    }

    const addItemsRow = () => {
        setFormData({
            ...formData, items: [...formData.items, {
                itemName: "",
                quantity: '',
                unit: '',
                rate: '',
                amount: '',
            }]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3000/invoice/create',
                { ...formData },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success === true) {
                toast.success('Invoice created successfully');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Error creating invoice:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        async function getItems() {
            try {
                const res = await getAllitems(token)
                setAllitem(res.data.items);
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || error.message)
            }
        }
        getItems()
    }, [token])

    return (
        <>
            <div className="invoice-form-container bg-white shadow-lg rounded-lg p-8 max-w-4xl">
                <div className="invoice-from-name mb-8 text-2xl font-semibold text-gray-800">
                    <p>Company Invoice</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="invoice-header-section grid grid-cols-2 gap-6 mb-6">
                        <div className="invoice-bill-no invoice-header-input-wrapper">
                            <label htmlFor="billNo" className="block text-gray-700 font-medium mb-2">Invoice Number :</label>
                            <input
                                type="text"
                                value={formData.billNo}
                                id="billNo"
                                name="billNo"
                                onChange={handleChange}
                                placeholder="Bill No."
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="invoice-bill-date invoice-header-input-wrapper">
                            <label htmlFor="billDate" className="block text-gray-700 font-medium mb-2">Bill Date :</label>
                            <input
                                type="date"
                                value={formData.billDate}
                                id="billDate"
                                onChange={handleChange}
                                name="billDate"
                                placeholder="Bill Date"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="invoice-bill-cust-name invoice-header-input-wrapper">
                            <label htmlFor="customerName" className="block text-gray-700 font-medium mb-2">Customer Name :</label>
                            <input
                                type="text"
                                value={formData.customerName}
                                id="customerName"
                                name="customerName"
                                onChange={handleChange}
                                placeholder="Customer Name"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="invoice-bill-due invoice-header-input-wrapper">
                            <label htmlFor="billDueDate" className="block text-gray-700 font-medium mb-2">Due Date :</label>
                            <input
                                type="date"
                                value={formData.billDueDate}
                                id="billDueDate"
                                name="billDueDate"
                                onChange={handleChange}
                                placeholder="Due Date"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="invoice-item-section mb-6">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border border-gray-300">Sr.No</th>
                                    <th className="p-2 border border-gray-300">Item Name</th>
                                    <th className="p-2 border border-gray-300">Quantity</th>
                                    <th className="p-2 border border-gray-300">Unit</th>
                                    <th className="p-2 border border-gray-300">Rate</th>
                                    <th className="p-2 border border-gray-300">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr className="invoice-item-row bg-white even:bg-gray-50" key={index}>
                                        <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                                        <td className="p-2 border border-gray-300">
                                            <select
                                                name="itemName"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Select Item</option>
                                                {allItem.map((itm) => (
                                                    <option key={itm._id} value={itm.itemName}>{itm.itemName}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border border-gray-300">
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                placeholder="Quantity"
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-300">
                                            <input
                                                type="text"
                                                name="unit"
                                                value={item.unit}
                                                placeholder="Unit"
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-300">
                                            <input
                                                type="number"
                                                name="rate"
                                                value={item.rate}
                                                readOnly
                                                placeholder="Rate"
                                                className="w-full p-1 border rounded bg-gray-100 focus:outline-none"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-300">
                                            <input
                                                type="number"
                                                name="amount"
                                                value={item.amount}
                                                readOnly
                                                placeholder="Amount"
                                                className="w-full p-1 border rounded bg-gray-100 focus:outline-none"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addItemsRow} className="mt-4 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200">Add row</button>
                    </div>

                    <div className="invoice-tax-section grid grid-cols-3 gap-4 mb-6">
                        <div className="invoice-tax-field">
                            <label className="block text-gray-700 font-medium mb-2">C.GST:</label>
                            <input
                                type="number"
                                name="cgst"
                                value={formData.cgst}
                                onChange={handleChange}
                                placeholder="CGST"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div className="invoice-tax-field">
                            <label className="block text-gray-700 font-medium mb-2">S.GST:</label>
                            <input
                                type="number"
                                name="sgst"
                                value={formData.sgst}
                                onChange={handleChange}
                                placeholder="SGST"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div className="invoice-tax-field">
                            <label className="block text-gray-700 font-medium mb-2">Total:</label>
                            <input
                                type="number"
                                name="total"
                                value={formData.total}
                                onChange={handleChange}
                                placeholder="Total"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="submit-button mt-6 text-center">
                        <button
                            type="submit"
                            className="w-1/4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>

            <ToastContainer />
        </>
    );

};

export default InvoiceForm;
