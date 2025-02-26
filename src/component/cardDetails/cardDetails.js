import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

function CardDetails() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/carts")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Cards Data:", data);
        const limitedCards = data.carts.slice(0,1);
        setCards(limitedCards);
        // console.log("limitedCards",limitedCards);
        if (limitedCards.length > 0) {
          setSelectedCard(limitedCards[0].id);
          fetchCardData(limitedCards[0].id);
        }
      })
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);

  const fetchCardData = (cardId) => {
    fetch(`https://dummyjson.com/carts/${cardId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(`Card ${cardId} Data:`, data);
        if (data) {
          updateCardData(data);
        }
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  const updateCardData = (card) => {
    const transformedTransactions = card.products.map((product, index) => ({
      transaction: `TXN${card.id}${index + 1}`, 
      time: new Date().toLocaleTimeString(), 
      date: new Date().toLocaleDateString(), 
      amount: Math.round(product.price * product.quantity), 
      status: Math.random() > 0.5 ? "Success" : "Pending", 
    }));

    setTransactions(transformedTransactions);

    // data for Line Chart
    const categories = transformedTransactions.map((txn) => txn.transaction);
    const salesData = transformedTransactions.map((txn) => txn.amount);
    setLineChartData({ categories, data: salesData });

    // data for Pie Chart
    const totalExpense = salesData.reduce((acc, curr) => acc + curr, 0);
    const remainingBalance = 1000 - totalExpense;
    setPieChartData([
      { name: "Expense", y: totalExpense },
      { name: "Balance", y: remainingBalance > 0 ? remainingBalance : 0 },
    ]);
  };

  const handleCardChange = (event) => {
    const cardId = Number(event.target.value);
    setSelectedCard(cardId);
    fetchCardData(cardId);
  };

  return (
    <div className="px-2 md:px-10">
      <div className="dashboard-wrap">
        <div className="flex flex-col md:flex-row justify-between py-3 align-middle h-screen">

          <div className="w-full md:w-1/4 md:border-r-[1px] md:pr-5 pb-[50px] flex flex-col justify-between">
            <div className="w-full space-y-3">
              <label className="block text-sm/6 text-gray-700 font-bold">My Cards</label>
              {cards.length > 0 ? (
                cards.map((card) => (
                  <div key={card.id} className="w-full mb-2">
                    {/* <input
                      className="accent-[#6d3078]"
                      type="radio"
                      name="userSelectedCard"
                      value={card.id}
                      checked={selectedCard === card.id}
                      onChange={handleCardChange}
                    /> */}
                    <label className="ml-3" htmlFor={card.id}>
                      Card {card.id}
                    </label>
                    {selectedCard === card.id && (
                      <div className="relative w-full show">
                        <div className="card-bg bg-cover w-[250px] h-[165px] rounded-[25px] text-white flex flex-col justify-evenly">
                          <div className="px-5 py-2">
                            <p>Credit Card</p>
                          </div>
                          <div className="px-5 py-2">
                            <p className="tracking-[2px]">4111 1111 1111 111{card.id}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Loading cards...</p>
              )}
            </div>

            <div className="flex flex-row gap-3">
              <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                <Link to="/EditProfile">Edit Profile</Link>
              </button>
              <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                <Link to="/ChangePin">Change Pin</Link>
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/4 px-5 overflow-y-auto pb-[50px] scrollbar-hide">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <LineChart categories={lineChartData.categories} data={lineChartData.data} />
              </div>
              <div className="w-full md:w-1/2">
                <PieChart pieData={pieChartData} />
              </div>
            </div>

            <h1 className="text-center text-[24px] my-5 font-bold">Transaction History</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 md:max-w-[500px] md:overflow-x-scroll">
                <thead>
                  <tr className="bg-[#D9D9D9]">
                    <th className="px-4 py-2 text-left border-b">Transaction</th>
                    <th className="px-4 py-2 text-left border-b">Time</th>
                    <th className="px-4 py-2 text-left border-b">Date</th>
                    <th className="px-4 py-2 text-left border-b">Amount</th>
                    <th className="px-4 py-2 text-left border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} className="odd:bg-white even:bg-[#F2F2F2]">
                        <td className="px-4 py-2 border-b">{transaction.transaction}</td>
                        <td className="px-4 py-2 border-b">{transaction.time}</td>
                        <td className="px-4 py-2 border-b">{transaction.date}</td>
                        <td className="px-4 py-2 border-b">₹ {transaction.amount}</td>
                        <td
                          className={`px-4 py-2 border-b font-bold ${
                            transaction.status === "Success" ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {transaction.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center">Loading transactions...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;