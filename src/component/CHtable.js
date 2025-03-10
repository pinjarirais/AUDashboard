import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import { ExportToExcel } from "./ExportToExcel";
import { Link } from "react-router-dom";

function CHtable({ userData }) {
  const [currentpg, setCurrentPg] = useState(0);
  const [ExcelData, setExcelData] = useState([]);
  const datalength = userData?.chUsers?.length || 0;
  const numberpg = Math.ceil(datalength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];
  const startpg = currentpg * 10;
  const endpg = startpg + 10;

  const fileName = "CHUsers"; // Excel file name

  useEffect(() => {
    if (!userData?.chUsers) return;

    // Reshaping data for Excel export
    const customHeadings = userData.chUsers.map((user) => {
      const cardHolder = user.cardHolders?.[0] || {}; // Ensure cardHolders exists
      return {
        "Id": user.id,
        "Card Number": cardHolder.cardNumber || "N/A",
        "Name": user.name,
        "Pancard Number": cardHolder.pancardNumber || "N/A",
        "Email": user.email,
        "Phone": user.phone,
      };
    });

    setExcelData(customHeadings);
  }, [userData]); // Added dependency

  return (
    <>
      <div className="flex justify-end">
        {/* Uncomment this if ExportToExcel is needed */}
        {/* <div>
          <ExportToExcel apiData={ExcelData} fileName={fileName} />
        </div> */}
        <div>
          <Pagination pagenumber={pagenumber} currentpg={currentpg} setCurrentPg={setCurrentPg} />
        </div>
      </div>
      <div>
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Card Number</th>
              <th className="border border-gray-300 bg-gray-200 p-2">User Name</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Pancard Number</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.chUsers?.slice(startpg, endpg).map((item) => {
              const cardHolder = item.cardHolders?.[0] || {}; // Avoid undefined error

              return (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    {cardHolder.cardNumber ? (
                      <Link className="text-blue-700 underline" to={`/cardDetails/${item.id}`}>
                        {cardHolder.cardNumber}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{cardHolder.pancardNumber || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">{item.phone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CHtable;
