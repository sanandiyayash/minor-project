import React, { useState, useEffect } from 'react'
import { getAllitems } from '../../api'
import { Link } from 'react-router-dom'

const AllItems = () => {
    const [allitems, setAllitems] = useState([])
    useEffect(() => {
        async function getItems() {
            try {
                const token = localStorage.getItem('token')

                const res = await getAllitems(token)
                setAllitems(res.data.items)

            } catch (error) {
                console.log(error.response?.data?.message || error.message);

            }
        }

        getItems()
    }, [])

    return (
        <>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">Items</th>
                        <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {allitems.length > 0 ? (
                        allitems.map((item) => (
                            <tr key={item._id}>
                                <td className="border border-gray-300 px-4 py-2">
                                    <Link to={`/item/${item._id}/edit`} className="text-blue-500 hover:underline">
                                        {item.itemName}
                                    </Link>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.price.toLocaleString('en-US')} Rs
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">No item</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )

}

export default AllItems