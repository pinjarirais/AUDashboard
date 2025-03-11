import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { FadeLoader } from "react-spinners";
import ToastNotification from "../../component/ToastNotification";
import useDataFetch from "../../hooks/useDataFetch";

function CardDetails() {
  const [cards, setCards] = useState([]);
  const [transactionsData, setTransactionsData] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [threeMonths, setThreeMonths] = useState([]);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("token"));
  let chUserAPI = "http://localhost:8081/api/cardholders/phone/9767087882";
  let [userData, isLoding, isError, exlData] = useDataFetch(chUserAPI, token);

  const { id } = useParams();
  
  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
  const fromNintyDays = getFormattedDate(threeMonthsAgo);
  const toDate = getFormattedDate(currentDate);

  useEffect(() => {
    fetchAllCards();
    fetchThreeMonthTransactions();
  }, []);

  const fetchAllCards = async () => {
    try {
      setIsLoading(true);
      const headers = { "Content-Type": "application/json" };

      const apiCalls = [
        axios.get("https://dummyjson.com/carts", { headers }),
        axios.get("https://dummyjson.com/users", { headers }),
        axios.get("https://dummyjson.com/products", { headers }),
      ];

      const [cartsResponse] = await Promise.all(apiCalls);
      setIsLoading(false);
      const fetchedCards = cartsResponse.data.carts.slice(0, 1);
      setCards(fetchedCards);

      const allTransactions = {};
      fetchedCards.forEach((card) => {
        allTransactions[card.id] = transformTransactions(card);
      });
      setTransactionsData(allTransactions);

      if (fetchedCards.length > 0) {
        setSelectedCard(fetchedCards[0].id);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
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

  const fetchThreeMonthTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/expenses/by-card/${id}/by-date-range?fromDate=${fromNintyDays}&toDate=${toDate}`
      );
      setThreeMonths(response.data);
    } catch (error) {
      console.error("Error fetching past three months transactions:", error);
    }
  };

  useEffect(() => {
    if (threeMonths.transactions && threeMonths.transactions.length > 0) {
      updateCardData(threeMonths.transactions);
    }
  }, [threeMonths]);

  const updateCardData = (transactions) => {
    transactions.sort((a, b) => new Date(a.transactionDateTime) - new Date(b.transactionDateTime));

    setLineChartData({
      categories: transactions.map((txn) => new Date(txn.transactionDateTime).toLocaleDateString()),
      data: transactions.map((txn) => txn.amount),
    });

    const totalExpense = transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const remainingBalance = 1000 - totalExpense;

    setPieChartData([
      { name: "Expense", y: totalExpense },
      { name: "Balance", y: remainingBalance > 0 ? remainingBalance : 0 },
    ]);
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
            <div className="flex flex-col md:flex-row justify-between py-3 align-middle md:h-[85vh]">
              <div className="w-full md:w-1/4 md:border-r-[1px] md:pr-5 pb-[50px] flex flex-col justify-between">
                <label className="block text-sm/6 text-gray-700 font-bold text-center md:text-left">My Cards</label>
                {cards.length > 0 ? (
                  cards.map((card) => (
                    <div key={card.id} className="w-full mb-2">
                      <ToastNotification message={`Data loaded successfully for ${id}`} type="success" />
                      <label className="block w-full mx-auto md:ml-3 text-center md:text-left">
                        Card {card.id}
                      </label>
                    </div>
                  ))
                ) : (
                  <FadeLoader color="#9a48a9" />
                )}
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
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-[#D9D9D9]">
                        <th className="px-4 py-2 text-left border-b">Transaction</th>
                        <th className="px-4 py-2 text-left border-b">Time</th>
                        <th className="px-4 py-2 text-left border-b">Date</th>
                        <th className="px-4 py-2 text-left border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threeMonths.transactions && threeMonths.transactions.length > 0 ? (
                        threeMonths.transactions.map((transaction, index) => (
                          <tr key={index} className="odd:bg-white even:bg-[#F2F2F2]">
                            <td className="px-4 py-2 border-b">{transaction.transactionId}</td>
                            <td className="px-4 py-2 border-b">{new Date(transaction.transactionDateTime).toLocaleTimeString()}</td>
                            <td className="px-4 py-2 border-b">{new Date(transaction.transactionDateTime).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border-b">₹ {transaction.amount}</td>
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