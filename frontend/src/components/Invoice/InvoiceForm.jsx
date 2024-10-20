import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllitems, createInvoice } from '../../api'
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

    const [allItem, setAllitem] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'cgst' || name === 'sgst') {
            calculateTotals(formData.items, {
                ...formData,
                [name]: value
            });
        }
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

        calculateTotals(newItems);
    };

    const calculateTotals = (items, updatedFormData = formData) => {
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const cgstRate = parseFloat(updatedFormData.cgst) || 0;
        const sgstRate = parseFloat(updatedFormData.sgst) || 0;
        const cgstAmount = (totalAmount * cgstRate) / 100;
        const sgstAmount = (totalAmount * sgstRate) / 100;
        const total = totalAmount + cgstAmount + sgstAmount;

        setFormData({
            ...updatedFormData,
            items: items,
            total: total.toFixed(2),
        });
    };

    const addItemsRow = () => {
        setFormData({
            ...formData, items: [...formData.items, {
                itemName: "",
                quantity: '',
                unit: '',
                rate: '',
                amount: '',
            }]
        });
    };

    const removeLastItemRow = () => {
        const updatedItems = [...formData.items];
        if (updatedItems.length > 1) {
            updatedItems.pop();
            setFormData({
                ...formData,
                items: updatedItems,
            });
            calculateTotals(updatedItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await createInvoice(token, { ...formData });

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

    const handleItemClick = () => {
        if (allItem.length <= 0) {
            toast.error('No items available. Add items.');
        }
    };



    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getItems = async () => {
            try {
                setLoading(true);
                const res = await getAllitems(token);
                setAllitem(res.data.items);
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        getItems();
    }, [token]);

    useEffect(() => {

        if (!loading && allItem.length === 0) {
            toast.error('No items available. Add items to create invoice');
        }
    }, [loading]);

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
                                                onClick={handleItemClick}
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
                                            {/* <input
                                                type="text"
                                                name="unit"
                                                value={item.unit}
                                                placeholder="Unit"
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            /> */}


                                            <select name="unit"
                                                value={item.unit}
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="pcs">Pcs</option>
                                                <option value="Kg">Kg</option>
                                            </select>
                                        </td>
                                        <td className="p-2 border border-gray-300">
                                            <input
                                                type="number"
                                                name="rate"
                                                value={item.rate}
                                                placeholder="Rate"
                                                onChange={(e) => handleItemChange(e, index)}
                                                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-300"><p className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-purple-500">{item.amount || 0}</p></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex space-x-4 mt-4">
                            <button type="button" onClick={addItemsRow} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add row</button>
                            {formData.items.length > 1 && (
                                <button type="button" onClick={removeLastItemRow} className=" bg-red-500 text-white  hover:bg-red-600 transition duration-200 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Remove last row</button>
                            )}
                        </div>
                    </div>

                    <div className="invoice-tax-section grid grid-cols-3 gap-6 mb-6">
                        <div className="cgst-wrapper invoice-header-input-wrapper">
                            <label htmlFor="cgst" className="block text-gray-700 font-medium mb-2">CGST % :</label>
                            <input
                                type="number"
                                value={formData.cgst}
                                id="cgst"
                                name="cgst"
                                onChange={handleChange}
                                placeholder="CGST"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="sgst-wrapper invoice-header-input-wrapper">
                            <label htmlFor="sgst" className="block text-gray-700 font-medium mb-2">SGST % :</label>
                            <input
                                type="number"
                                value={formData.sgst}
                                id="sgst"
                                name="sgst"
                                onChange={handleChange}
                                placeholder="SGST"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="total-wrapper invoice-header-input-wrapper">
                            <label htmlFor="total" className="block text-gray-700 font-medium mb-2">Total :</label>
                            <input
                                type="number"
                                value={formData.total}
                                id="total"
                                name="total"
                                disabled
                                placeholder="Total"
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        Submit Invoice
                    </button>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default InvoiceForm;
