import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import { ExportToExcel } from "./ExportToExcel";
import { Link } from "react-router-dom";

function CHtable({ userData }) {
  const [currentpg, setCurrentPg] = useState(0);
  const [ExcelData, setExcelData] = useState([]);

  const datalength = userData?.cardHolders?.length || 0;
  const numberpg = Math.ceil(datalength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];
  const startpg = currentpg * 10;
  const endpg = startpg + 10;

  const fileName = "CHUsers";

  useEffect(() => {
    if (userData?.cardHolders) {
      const customHeadings = userData.cardHolders.map((item) => ({
        Id: item.id,
        "Card Number": item.cardNumber,
        Name: userData.name,
        "Pancard Number": item.pancardNumber,
        Email: userData.email,
        Phone: userData.phone,
      }));
      setExcelData(customHeadings);
    }
  }, [userData]);

  return (
    <>
      {/* <div className="flex justify-end">
        <div>
          <ExportToExcel apiData={ExcelData} fileName={fileName} />
        </div> 
        <div>
          <Pagination
            pagenumber={pagenumber}
            currentpg={currentpg}
            setCurrentPg={setCurrentPg}
          />
        </div>
      </div> */}
      <div className="mt-4">
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Card Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                User Name
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Pancard Number
              </th>

              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.cardHolders?.slice(startpg, endpg).map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.id}</td>
                <td className="border border-gray-300 p-2">
                  {item.cardNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  <Link
                    className="text-blue-700 underline"
                    to={`/cardDetails/${item.id}`}
                  >
                    {userData.name}
                  </Link>
                </td>

                <td className="border border-gray-300 p-2">
                  {item.pancardNumber}
                </td>
                <td className="border border-gray-300 p-2">{userData.email}</td>
                <td className="border border-gray-300 p-2">{userData.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CHtable;
