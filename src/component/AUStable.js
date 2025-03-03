import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import { ExportToExcel } from "./ExportToExcel";
import { Link } from "react-router-dom";

function AUStable({ userData, currentpg, setCurrentPg }) {
  //const [currentpg, setCurrentPg] = useState(0);
  const [ExcelData, setExcelData] = useState([]);
  const datalength = userData?.cardHolders?.length;
  //const numberpg = Math.ceil(datalength / 10);
  const numberpg = Math.ceil(50 / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];
  //const startpg = currentpg * 10;
  //const endpg = startpg + 10;

  const fileName = "CHUsers"; // here enter filename for your excel file
  useEffect(() => {
    // reshaping the array
    const customHeadings = userData?.cardHolders?.map((item) => ({
      Id: item.id,
      "Card Number": item.cardNumber,
      Name: item.name,
      "Pancard Number": item.pancardNumber,
      Email: item.email,
      Phone: item.phone,
    }));

    setExcelData(customHeadings);
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <div>
            <ExportToExcel apiData={ExcelData} fileName={fileName} />
          </div>
          <div className="ml-4">
            <Link className="bg-blue-700 inline-flex h-8 text-white px-4 py-1 rounded-md cursor-pointer shadow-md" to="/uploaddata">Upload Lead</Link>
          </div>
        </div>
        <div>
          <Pagination
            pagenumber={pagenumber}
            currentpg={currentpg}
            setCurrentPg={setCurrentPg}
          />
        </div>
      </div>
      <div>
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Card Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">Name</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Pancard Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.cardHolders &&
              userData?.cardHolders?.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    <Link className="text-blue-700 underline" to={`/cardDetails/${item.id}`}>{item.cardNumber}</Link>
                  </td>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">
                    {item.pancardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">{item.phone}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AUStable;
