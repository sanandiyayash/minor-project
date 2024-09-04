import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteInvoice, getSingleInvoice } from '../../api';

const InvoiceDetails = () => {
    const [invoice, setInvoice] = useState([]);
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSingleInvoice = async () => {
            try {
                const response = await getSingleInvoice(token, id)

                setInvoice(response.data.invoice);

            } catch (error) {
                console.log(error);

            }
        };

        fetchSingleInvoice();
    }, [id, token]);

    const handleDeleteInvoice = async (e) => {

        try {
            const response = await deleteInvoice(token, id)

            if (response.data.success) {
                navigate('/')

            }

        } catch (error) {
            console.log(error.response.data.message || error.message);
            toast.error(error.response.data.message || error.message);

        }
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
            <div className="invoice-details space-y-6">
                {/* Invoice Information */}
                <table className="w-full border border-gray-300">
                    <tbody>
                        <tr>
                            <th className="p-2 text-left bg-gray-100 border-b border-gray-300">Bill No</th>
                            <td className="p-2 border-b border-gray-300">{invoice.billNo}</td>
                        </tr>
                        <tr>
                            <th className="p-2 text-left bg-gray-100 border-b border-gray-300">Bill Date</th>
                            <td className="p-2 border-b border-gray-300">{invoice.billDate}</td>
                        </tr>
                        <tr>
                            <th className="p-2 text-left bg-gray-100 border-b border-gray-300">Customer Name</th>
                            <td className="p-2 border-b border-gray-300">{invoice.customerName}</td>
                        </tr>
                        <tr>
                            <th className="p-2 text-left bg-gray-100">Bill Due Date</th>
                            <td className="p-2">{invoice.billDueDate}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Items Section */}
                <h3 className="text-xl font-semibold mb-2">Items</h3>
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border-b border-gray-300">Item Name</th>
                            <th className="p-2 border-b border-gray-300">Quantity</th>
                            <th className="p-2 border-b border-gray-300">Unit</th>
                            <th className="p-2 border-b border-gray-300">Rate</th>
                            <th className="p-2 border-b border-gray-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items && invoice.items.length > 0 ? (
                            invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2 border-b border-gray-300">{item.itemName}</td>
                                    <td className="p-2 border-b border-gray-300">{item.quantity}</td>
                                    <td className="p-2 border-b border-gray-300">{item.unit}</td>
                                    <td className="p-2 border-b border-gray-300">{item.rate}</td>
                                    <td className="p-2 border-b border-gray-300">{item.amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-2 text-center">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Tax and Total Section */}
                <table className="w-full border border-gray-300">
                    <tbody>
                        <tr>
                            <th className="p-2 text-left bg-gray-100 border-b border-gray-300">CGST</th>
                            <td className="p-2 border-b border-gray-300">{invoice.cgst}</td>
                        </tr>
                        <tr>
                            <th className="p-2 text-left bg-gray-100 border-b border-gray-300">SGST</th>
                            <td className="p-2 border-b border-gray-300">{invoice.sgst}</td>
                        </tr>
                        <tr>
                            <th className="p-2 text-left bg-gray-100">Total</th>
                            <td className="p-2">{invoice.total}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Delete Button */}
                <button
                    onClick={handleDeleteInvoice}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                    Delete Invoice
                </button>
            </div>
        </>
    );

};

export default InvoiceDetails;
