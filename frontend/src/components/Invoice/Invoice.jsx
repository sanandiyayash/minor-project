import React, { useEffect, useState } from 'react'
import { allInvoice } from '../../api'
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const Invoice = () => {
    const [allInvoices, setAllInvoices] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {

        const fetchInvoices = async () => {

            try {
                const token = localStorage.getItem('token');
                const response = await allInvoice(token)
                setAllInvoices(response.data.invoices)


            } catch (error) {
                console.log(error.message || error);
                toast.error(error.response?.data?.message || error.message);
                setTimeout(() => {

                    navigate('/login')
                }, 1000);

            }

        }
        fetchInvoices()

    }, [])

    return (
        <>
            <div className="all-invoice p-8">
                <div className="all-invoice-header mb-4">
                    <h2 className="text-3xl font-bold mb-4">Invoice</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b">Sr.NO</th>
                                <th className="py-2 px-4 border-b">Customers</th>
                                <th className="py-2 px-4 border-b">Amount</th>
                                <th className="py-2 px-4 border-b">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allInvoices.length > 0 ? (
                                allInvoices.map((invoice, index) => (
                                    <tr key={invoice._id} className="text-center">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link to={`/invoice/${invoice._id}`} className="text-blue-500 hover:underline">
                                                {invoice.customerName}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 border-b">{invoice.total}</td>
                                        <td className="py-2 px-4 border-b">{moment(invoice.billDate).format('DD-MM-YYYY')}</td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td>No invoices</td>

                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <button className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                    <Link to='/invoice/new'>Create Invoice</Link>
                </button>
            </div>
            <ToastContainer />
        </>
    );

}

export default Invoice