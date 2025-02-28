import React, { useEffect, useState } from "react";
//import { useOutletContext } from "react-router-dom";
import useDataFetch from "../hooks/useDataFetch";
import CHtable from "../component/CHtable";
import AUStable from "../component/AUStable";
import { useData } from "../component/dataProvider";

function Dashboard() {
  //const { setTitle } = useOutletContext(); 
  const { setSharedData } = useData(); 
  const token = JSON.parse(localStorage.getItem("token"));
  const authuser = JSON.parse(localStorage.getItem("authuser"));
  const mobileNumber = JSON.parse(localStorage.getItem("mobileNumber"));

  const [currentpg, setCurrentPg] = useState(0);

  console.log("authuser >>>>>>>", authuser);
  const AUS = `http://localhost:8081/api/cardholders/ausUsers/1/cardholders?page=${currentpg}&size=10`;
  const CH = `http://localhost:8081/api/cardholders/phone/${mobileNumber}`;

  const [localtoken, setLocalToken] = useState(authuser);
  let [userData, isLoding, isError, exlData] = useDataFetch(
    localtoken == "AUS USER" ? AUS : CH,
    token
  );

  console.log("userData >>>>>>>>", userData);

  if(userData){
    setSharedData(userData)
  }

  

  return isError ? (
    <div className="flex justify-center items-center h-[400px] ">
      <h2 className="text-red-600">{isError.code}</h2>
    </div>
  ) : (
    <>
      <div className="px-10">
        <div className="dashboard-wrap">
          <div className="flex flex-auto justify-between border-b-[1px] py-5 align-middle">
            <div>
              <h1 className="text-[22px] bold">Dashboard</h1>
            </div>
            <div className="top-search">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6d3078]-500 focus:border-[#6d3078]-500"
              ></input>
            </div>
          </div>

          <div className="pb-16 pt-4 mx-auto">
            {isLoding ? (
              <div className="flex justify-center items-center h-[400px]">
                <h2>Loading...</h2>
              </div>
            ) : localtoken == "AUS USER" ? (
              <AUStable
                userData={userData}
                exlData={exlData}
                setCurrentPg={setCurrentPg}
                currentpg={currentpg}
              />
            ) : (
              <CHtable userData={userData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
