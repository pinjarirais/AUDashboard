import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import DonutChart from "./DonutChart";

import { FadeLoader } from "react-spinners";
// import ToastNotification from "../../component/ToastNotification";
import CardList from "./cardList";
import TransactionHistory from "./transactionHistory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import StackedBarChart from "./StackedBarChart";

function CardDetails() {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setselectedCardId] = useState(null);
  const [trasactionData, setTransactionData] = useState([]);
  const [lineChartData, setLineChartData] = useState({ categories: [], data: [] });
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [areaChartData, setAreaChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [StackedBarChartData,setStackedBarData]=useState([]);
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
        setselectedCardId(fetchedCards[0].id);
        fetchTransactionDetails(fetchedCards[0].id,fromNintyDays,toDate)
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching cards:", error);
    }
  };


  //fetch expenses details
  const fetchTransactionDetails = async (id,fromDate,toDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/expenses/by-card/${id}/by-date-range?fromDate=${fromDate}&toDate=${toDate}`,
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
      setBarChartData([]);
      setAreaChartData([]);
      setDonutChartData([]);
      setStackedBarData([]);
    }
  }, [trasactionData, selectedCardId]);


  //Chart Logic
  const updateCardData = (transactions) => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      setPieChartData([]);
      setBarChartData([]);
      setDonutChartData([]);
      setAreaChartData({ categories: [], data: [] });
      setLineChartData({ categories: [], data: [] });
      setStackedBarData([]); 
      setAreaChartData([]);
      setBarChartData([]);
      setLineChartData([]);
      setDonutChartData([]);
      
      return;
    }
    transactions.sort((a, b) => new Date(a.transactionDateTime) - new Date(b.transactionDateTime));
    const categories = transactions.map((txn) => new Date(txn.transactionDateTime).toLocaleDateString());
    const data = transactions.map((txn) => txn.amount);
    
    setLineChartData({ categories, data });
    setAreaChartData({ categories, data });
    const categoryMap = transactions.reduce((acc, txn) => {
      if (!txn.category || typeof txn.amount !== "number") return acc;
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});
  
    const categoryData = Object.entries(categoryMap).map(([category, amount]) => ({
      name: category,
      y: amount,
    }));
  
    setPieChartData(categoryData);
    setBarChartData(categoryData);
    setDonutChartData(categoryData);
    const groupedData = transactions.reduce((acc, txn) => {
      const date = new Date(txn.transactionDateTime).toLocaleDateString();
      if (!acc[date]) acc[date] = { date };
      acc[date][txn.category] = (acc[date][txn.category] || 0) + txn.amount;
      return acc;
    }, {});
  
    const formattedStackedData = Object.values(groupedData);
    setStackedBarData(formattedStackedData);
  };
  
  

  const handleCardSelection = (cardId) => {
    setselectedCardId(cardId);
    // setIsLoading(true);
    fetchTransactionDetails(cardId,fromDate, newToDate);
  };

  const handleShowClick = () => {
    setIsLoading(true)
    fetchTransactionDetails(selectedCardId,fromDate, newToDate);
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
              <CardList handleCardSelection={handleCardSelection} cards={cards} selectedCard={selectedCardId} trasactionData={trasactionData} ChuserID={id}/>

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
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                  <BarChart barData={barChartData} />
                  </div>
                  <div className="w-full md:w-1/2">
                  <AreaChart areaData={areaChartData} />
                  </div>
                  </div>
                  <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                  <DonutChart donutData={donutChartData} />
                  </div>
                  <div className="w-full md:w-1/2">
                  <StackedBarChart stackBarData={StackedBarChartData} />
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