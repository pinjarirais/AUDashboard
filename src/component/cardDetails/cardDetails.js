import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { FadeLoader } from "react-spinners";
// import ToastNotification from "../../component/ToastNotification";
import CardList from "./cardList";
import TransactionHistory from "./transactionHistory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

function CardDetails() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [trasactionData, setTransactionData] = useState([]);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [newToDate, setToDate] = useState("");
  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const [cardID, setCardID] = useState()


  //toDate and fromDate logic
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
  const fromNintyDays = getFormattedDate(threeMonthsAgo);
  const toDate = getFormattedDate(currentDate);
  const token = JSON.parse(localStorage.getItem("token"));
  const formatDate = (date) => date.toISOString().split("T")[0];
  const { id } = useParams();

  useEffect(() => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    setFromDate(formatDate(threeMonthsAgo));
    setToDate(formatDate(currentDate));
  }, []);

  useEffect(() => {
    fetchAllCards();
  }, []);



  //fetch all card details
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


  //fetch expenses details
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


  //Chart Logic
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
    // setIsLoading(true);
    fetchTransactionDetails(cardId);
  };


  //On Date Change Api
  const fetchDataOnDateChange = async (from, to) => {
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

  //calender custom icon
  const CustomDatePickerInput = ({ value, onClick }) => (
    <div
      className="relative w-full cursor-pointer"
      onClick={onClick}
    >
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-md bg-white px-3 py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px] pr-8"/>
      <FaCalendarAlt className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );


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
              <CardList handleCardSelection={handleCardSelection} cards={cards} selectedCard={selectedCard} trasactionData={trasactionData} ChuserID={id}/>

              {/* Charts & Transactions */}
              <div className="w-full md:w-3/4 md:px-5 overflow-y-auto pb-[100px] scrollbar-hide">
                <div className="md:max-w-96 mx-auto mb-10">
                  <div className="flex flex-row items-end gap-2 justify-center">
                    {/* <div>
                      <p><strong>From</strong></p>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        max={newToDate}
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px]"
                      />
                    </div> */}
                    {/* <div>
                      <p><strong>To</strong></p>
                      <input
                        type="date"
                        value={newToDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        max={getFormattedDate(new Date())} 
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px]"
                      />
                    </div> */}
                    <div>
                      <p><strong>From</strong></p>
                      <DatePicker
                        selected={fromDate ? new Date(fromDate) : null}
                        onChange={(date) => setFromDate(getFormattedDate(date))}
                        maxDate={newToDate ? new Date(newToDate) : new Date()}
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa]focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none 
                          text-[12px] md:text-[14px] h-[30px]"
                          customInput={<CustomDatePickerInput />}
                      />
                    </div>
                    <div>
                      <p><strong>To</strong></p>
                      <DatePicker
                        selected={newToDate ? new Date(newToDate) : null}
                        onChange={(date) => setToDate(getFormattedDate(date))}
                        minDate={fromDate ? new Date(fromDate) : null}
                        maxDate={new Date()}
                        className="w-full rounded-md bg-white px-0.5 py-0.8 md:px-3 md:py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px]"
                        customInput={<CustomDatePickerInput />}
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

                {/*Transaction Table */}
                <TransactionHistory trasactionData={trasactionData} />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardDetails;