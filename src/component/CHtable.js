import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import { Link } from "react-router-dom";
import MaskNumber from "./MaskNumber";

function CHtable({ userData }) {
  const [currentpg, setCurrentPg] = useState(0);
  const [ExcelData, setExcelData] = useState([]);

  const datalength = userData?.cardHolders?.length || 0;
  const numberpg = Math.ceil(datalength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];
  const startpg = currentpg * 10;
  const endpg = startpg + 10;

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
      <div className="flex justify-end">
        <Pagination
          pagenumber={pagenumber}
          currentpg={currentpg}
          setCurrentPg={setCurrentPg}
        />
      </div>

      <div>
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              {/* <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
               */}
              <th className="border border-gray-300 bg-gray-200 p-2">Card Numbers</th>
              <th className="border border-gray-300 bg-gray-200 p-2">User Name</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Pancard Number</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.cardHolders?.slice(startpg, endpg).map((item, index, arr) => {
              // Only show user info on the first row for each user
              const isFirstRow = index === 0;
              return (
                <tr key={item.id} className="text-center">
                  {/* <td className="border border-gray-300 p-2">{item.id}</td> */}
                 
                  {isFirstRow ? (
                    <>
                     <td className="border border-gray-300 p-2">
                      <ul className="list-disc ml-4 text-start">
                        {arr.map((ch) => (
                          <li key={ch.id}>
                            <MaskNumber accountNumber={ch.cardNumber}/>
                          </li>
                        ))}
                      </ul>
                    </td>
                      <td className="border border-gray-300 p-2 text-blue-700 underline" rowSpan={arr.length}>
                        <Link to={`/cardDetails/${item.id}`}>{userData.name}</Link>
                      </td>
                      <td className="border border-gray-300 p-2" rowSpan={arr.length}>
                        {item.pancardNumber}
                      </td>
                      <td className="border border-gray-300 p-2" rowSpan={arr.length}>
                        {userData.email}
                      </td>
                      <td className="border border-gray-300 p-2" rowSpan={arr.length}>
                        {userData.phone}
                      </td>
                    </>
                  ) : null}
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
