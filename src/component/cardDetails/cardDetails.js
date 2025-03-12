import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { FadeLoader } from "react-spinners";
// import ToastNotification from "../../component/ToastNotification";
import useDataFetch from "../../hooks/useDataFetch";

function CardDetails() {
  const [cards, setCards] = useState([]);
  const [transactionsData, setTransactionsData] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [trasactionData, setTransactionData] = useState([]);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [newToDate, setToDate] = useState("");
  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const [chUserCardData, setChUserCardData] = useState([]);
  const [cardID, setCardID] = useState()

  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
  const fromNintyDays = getFormattedDate(threeMonthsAgo);
  const toDate = getFormattedDate(currentDate);
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const formatDate = (date) => date.toISOString().split("T")[0];

    setFromDate(formatDate(threeMonthsAgo));
    setToDate(formatDate(currentDate));
  }, []);
  // let chUserAPI = "http://localhost:8081/api/cardholders/phone/9767087882";
  // let [userData, isLoding, isError, exlData] = useDataFetch(chUserAPI, token);
  const { id } = useParams();

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchAllCards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8081/api/cardholders/chUsers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      setIsLoading(false);

      const fetchedCards = response.data.cardHolders
      setCards(fetchedCards);
      fetchedCards.forEach((card) => {
      });
      if (fetchedCards.length > 0) {
        setSelectedCard(fetchedCards[0].id);
        fetchTransactionDetails(fetchedCards[0].id)
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching cards:", error);
    }
  };

  const fetchTransactionDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/expenses/by-card/${id}/by-date-range?fromDate=${fromNintyDays}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      setIsLoading(false);
      setTransactionData(response.data);

      setCardID(response.data)
    } catch (error) {
    }
  };

  useEffect(() => {
    if (trasactionData?.transactions?.length > 0) {
      updateCardData(trasactionData.transactions);
    } else {
      setLineChartData([]);
      setPieChartData([]);
    }
  }, [trasactionData, selectedCard]);

  const updateCardData = (transactions) => {
    transactions && transactions.sort((a, b) => new Date(a.transactionDateTime) - new Date(b.transactionDateTime));

    setLineChartData({
      categories: transactions && transactions.map((txn) => new Date(txn.transactionDateTime).toLocaleDateString()),
      data: transactions && transactions.map((txn) => txn.amount),
    });

    const totalExpense = transactions && transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const remainingBalance = 1000 - totalExpense;

    setPieChartData([
      { name: "Expense", y: totalExpense },
      { name: "Balance", y: remainingBalance > 0 ? remainingBalance : 0 },
    ]);
  };
  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
    updateCardData(transactionsData[cardId]);
    setIsLoading(true);
    fetchTransactionDetails(cardId);
  };

  const fetchDataOnDateChange = async (from, to) => {
    // console.log("selectedCard",selectedCard);
    try {

      const response = await axios.get(
        `http://localhost:8082/api/expenses/by-card/${selectedCard}/by-date-range?fromDate=${from}&toDate=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      setIsLoading(false)
      setTransactionData(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleShowClick = () => {
    setIsLoading(true)
    fetchDataOnDateChange(fromDate, newToDate);
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

              {/* Sidebar - Cards List */}
              <div className="w-full md:w-1/4 md:border-r-[1px] md:pr-5 pb-[50px] flex flex-col justify-between">
                <div className="flex flex-wrap flex-col justify-between h-full pb-[20px] relative h-[90%] overflow-y-auto scrollbar-hide">
                  <div className="space-y-3 mb-5 md:mb-0">
                    <label className="block text-sm/6 text-gray-700 font-bold text-center md:text-left">My Cards</label>
                    {cards.length > 0 ? (
                      cards.map((card) => (
                        <div key={card.id} className="w-full mb-2">
                          {/* <ToastNotification message={`Data loaded successfully for ${id} `} type="success" /> */}
                          <label className={`block w-full mx-auto md:ml-3 text-center md:text-left ${selectedCard == card.id ? "font-bold text-[#6d3078]" : ""}`}>
                            <input
                              type="radio"
                              name="card"
                              value={card.id}
                              checked={selectedCard === card.id}
                              onChange={() => handleCardSelection(card.id)}
                              className="mr-2 accent-[#6d3078]"
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
                                  <p className="tracking-[2px] md:tracking-[0.8px] lg:translate-[2px] md:text-[12px] lg:text-[16px]">{card.cardNumber}</p>
                                </div>
                              </div>
                              <div className="flex flex-row gap-3 md:text-[12px] lg:text-[16px] mt-2 mb-5">
                                <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                                  <Link to="/ChangePin" state={trasactionData}>Change Pin</Link>
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

                <div className="flex flex-row gap-3 md:text-[12px] lg:text-[18px]">
                  <button className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                    <Link to="/EditProfile" state={trasactionData}>Edit Profile</Link>
                  </button>
                </div>
              </div>

              {/* Charts & Transactions */}
              <div className="w-full md:w-3/4 md:px-5 overflow-y-auto pb-[100px] scrollbar-hide">
                <div className="md:max-w-96 mx-auto mb-10">
                  <div className="flex flex-row items-end gap-2 justify-center">
                    <div>
                      <p><strong>From</strong></p>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)} // Updates state on change
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px]"
                      />
                    </div>
                    <div>
                      <p><strong>To</strong></p>
                      <input
                        type="date"
                        value={newToDate}
                        onChange={(e) => setToDate(e.target.value)} // Updates state on change
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleShowClick}
                      className="w-[100px] bg-[#9a48a9] hover:bg-[#6d3078] text-white p-1.5 border-none rounded-md h-[30px] leading-[19px]"
                    >
                      Show
                    </button>
                  </div>
                </div>



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
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardDetails;