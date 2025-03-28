import React, {  useState } from "react";
//import { useOutletContext } from "react-router-dom";
import useDataFetch from "../hooks/useDataFetch";
import CHtable from "../component/CHtable";
import AUStable from "../component/AUStable";
import { useData } from "../component/dataProvider";

function Dashboard({setChUserId}) {
  //const { setTitle } = useOutletContext();
  // const { setSharedData } = useData();
  const token = JSON.parse(localStorage.getItem("token"));
  const authuser = JSON.parse(localStorage.getItem("authuser"));
  // const mobileNumber = JSON.parse(localStorage.getItem("mobileNumber"));
  const CHuserId = JSON.parse(localStorage.getItem("CHuserId"));
  const AUSuserId = JSON.parse(localStorage.getItem("AUSuserId"));

  const [currentpg, setCurrentPg] = useState(0);
  // const [totalLength, setTotalLength] = useState(0);

  console.log("authuser >>>>>>>", authuser);
  const AUS = `http://localhost:8081/api/cardholders/ausUsers/${AUSuserId}/chUsers?page=${currentpg}&size=10`;
  const CH = `http://localhost:8081/api/cardholders/chUsers/${CHuserId}`;

  const [localtoken, setLocalToken] = useState(authuser);
  let [userData, isLoding, isError, exlData] = useDataFetch(
    localtoken === "AUS USER" ? AUS : CH,
    token
  );

  console.log("userData >>>>>>>>", userData);
  if (userData?.name !== undefined && userData?.email !== undefined) {
    localStorage.setItem("profilename", JSON.stringify(userData?.name));
    localStorage.setItem("profilemail", JSON.stringify(userData?.email));
  
    // Dispatch event to notify Header component about the update
    window.dispatchEvent(new Event("profileUpdated"));
  }
  
  if (userData?.ausUser?.name !== undefined && userData?.ausUser?.email !== undefined) {
    localStorage.setItem("profilename", JSON.stringify(userData?.ausUser?.name));
    localStorage.setItem("profilemail", JSON.stringify(userData?.ausUser?.email));
  
    // Dispatch event to notify Header component about the update
    window.dispatchEvent(new Event("profileUpdated"));
  }
  
  
  let AUStotalLenght = userData?.totalElements;

  console.log("AUStotalLenght >>>>>>>", AUStotalLenght);

  // useEffect(()=>{
  //   if (userData?.totalElements !== undefined) {
  //     setTotalLength(userData?.totalElements);
  //   }
  // },[])

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
              <h1 className="text-[24px] font-bold">DASHBOARD</h1>
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
            ) : localtoken === "AUS USER" ? (
              <AUStable
                userData={userData}
                exlData={exlData}
                setCurrentPg={setCurrentPg}
                currentpg={currentpg}
                AUStotalLenght={AUStotalLenght}
                setChUserId={setChUserId}
              />
            ) : (
              <CHtable userData={userData} setChUserId={setChUserId} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;