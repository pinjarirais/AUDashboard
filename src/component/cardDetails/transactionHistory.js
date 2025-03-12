import React from 'react'
import { Link} from "react-router-dom";

function transactionHistory({trasactionData}) {
    // console.log("trasactionData",trasactionData)
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#D9D9D9]">
                            <th className="px-4 py-2">Transaction</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trasactionData.transactions?.length > 0 ? (
                            trasactionData.transactions.map((txn, index) => (
                                <tr key={index} className="odd:bg-white even:bg-[#F2F2F2]">
                                    <td className="px-4 py-2">{txn.transactionId}</td>
                                    <td className="px-4 py-2">{new Date(txn.transactionDateTime).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2">{new Date(txn.transactionDateTime).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">₹ {txn.amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center">No Transactions</td></tr>
                        )}
                    </tbody>
                </table>
                <div className="flex flex-col-reverse flex-wrap justify-evenly content-end pt-4">
                    <button className="w-[100px] bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                        <Link to="">Billing</Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export default transactionHistory
