import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { FadeLoader } from "react-spinners";

function CardDetails() {
  const [cards, setCards] = useState([]);
  const [transactionsData, setTransactionsData] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);
  const { cardNo } = useParams();
  // console.log("cardNo",cardNo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchAllCards = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/carts");
      setIsLoading(false);

      const fetchedCards = response.data.carts.slice(0, 1);
      setCards(fetchedCards);

      const allTransactions = {};
      fetchedCards.forEach((card) => {
        allTransactions[card.id] = transformTransactions(card);
      });

      setTransactionsData(allTransactions);
      if (fetchedCards.length > 0) {
        const defaultCard = fetchedCards[0].id;
        setSelectedCard(defaultCard);
        updateCardData(allTransactions[defaultCard]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching cards:", error);
    }
  };

  const transformTransactions = (card) => {
    return card.products.map((product, index) => ({
      transaction: `TXN${card.id}${index + 1}`,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      amount: Math.round(product.price * product.quantity),
      status: Math.random() > 0.5 ? "Success" : "Pending",
    }));
  };

  const updateCardData = (transactions) => {
    setLineChartData({
      categories: transactions.map((txn) => txn.transaction),
      data: transactions.map((txn) => txn.amount),
    });

    const totalExpense = transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const remainingBalance = 1000 - totalExpense;
    setPieChartData([
      { name: "Expense", y: totalExpense },
      { name: "Balance", y: remainingBalance > 0 ? remainingBalance : 0 },
    ]);
  };

  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
    updateCardData(transactionsData[cardId]);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <FadeLoader color="#9a48a9" />
        </div>
      ) : (
        <div className="px-2 lg:px-10">
          <div className="dashboard-wrap">
            <div className="flex flex-col md:flex-row justify-between py-3 align-middle md:h-screen">
              <div className="w-full md:w-1/4 md:border-r-[1px] md:pr-5 pb-[50px] flex flex-col justify-between">
                <div className="w-full space-y-3 mb-5 md:mb-0">
                  <label className="block text-sm/6 text-gray-700 font-bold text-center md:text-left">My Cards</label>
                  {cards.length > 0 ? (
                    cards.map((card) => (
                      <div key={card.id} className="w-full mb-2">
                        <label className="block w-full mx-auto md:ml-3 text-center md:text-left">
                          <input
                            type="radio"
                            name="card"
                            value={card.id}
                            checked={selectedCard === card.id}
                            onChange={() => handleCardSelection(card.id)}
                            className="mr-2"
                          />
                          Card {card.id}
                        </label>
                        {selectedCard === card.id && (
                          <div className="relative w-full show">
                            <div className="mx-auto md:ml-1 card-bg bg-cover w-[250px] h-[165px] xl:w-[250px] xl:h-[165px] lg:w-[210px] lg:h-[140px] md:w-[170px] md:h-[110px] rounded-[25px] text-white flex flex-col justify-evenly">
                              <div className="px-5 py-2">
                                <p>Credit Card</p>
                              </div>
                              <div className="px-5 py-2">
                                <p className="tracking-[2px] md:tracking-[0.8px] lg:translate-[2px] md:text-[12px] lg:text-[16px]">{cardNo}</p>
                              </div>
                            </div>
                            <div className="flex flex-row gap-3 md:text-[12px] lg:text-[16px] mt-5">
                              <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                                <Link to="/EditProfile">Edit Profile</Link>
                              </button>
                              <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                                <Link to="/ChangePin">Change Pin</Link>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-screen">
                      <FadeLoader color="#9a48a9" />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-3/4 md:px-5 overflow-y-auto pb-[100px] scrollbar-hide">
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
                      {transactionsData[selectedCard]?.length > 0 ? (
                        transactionsData[selectedCard].map((transaction, index) => (
                          <tr key={index} className="odd:bg-white even:bg-[#F2F2F2]">
                            <td className="px-4 py-2 border-b">{transaction.transaction}</td>
                            <td className="px-4 py-2 border-b">{transaction.time}</td>
                            <td className="px-4 py-2 border-b">{transaction.date}</td>
                            <td className="px-4 py-2 border-b">₹ {transaction.amount}</td>
                            <td className={`px-4 py-2 border-b font-bold ${transaction.status === "Success" ? "text-green-600" : "text-yellow-600"}`}>
                              {transaction.status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-2 text-center">No Transactions</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardDetails;
