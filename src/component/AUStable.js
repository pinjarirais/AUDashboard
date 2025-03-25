import React, { useEffect, useState, useMemo, Suspense } from "react";
import Pagination from "./pagination";
import { ExportToExcel } from "./ExportToExcel";
import { Link } from "react-router-dom";
import { MaskNumber, PhoneNumber } from "../hooks/MaskNumber";

// Lazy load TableBody for better performance
const TableBody = React.lazy(() => import("./TableBody"));

function AUStable({ userData, currentpg, setCurrentPg, AUStotalLenght }) {
  const [loading, setLoading] = useState(true);
  const fileName = "CHUsers"; // Filename for Excel export

  useEffect(() => {
    if (userData?.chUsers) setLoading(false);
  }, [userData]);

  // Memoized Excel Data to avoid recomputing on every render
  const ExcelData = useMemo(() => {
    return userData?.chUsers?.map((item) => ({
      Id: item.id,
      "Card Number": item.cardHolders?.[0]?.cardNumber || "N/A",
      Name: item.name,
      "Pancard Number": item.cardHolders?.[0]?.pancardNumber || "N/A",
      Email: item.email,
      Phone: item.phone,
    })) || [];
  }, [userData]);

  const numberpg = Math.ceil(AUStotalLenght / 10);
  const pagenumber = useMemo(() => [...Array(numberpg || 1).keys()], [numberpg]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <ExportToExcel apiData={ExcelData} fileName={fileName} />
          <Link
            className="bg-[#6d3078] ml-4 inline-flex h-8 text-white px-4 py-1 rounded-md cursor-pointer shadow-md"
            to="/uploaddata"
          >
            Upload Lead
          </Link>
        </div>
        <Pagination pagenumber={pagenumber} currentpg={currentpg} setCurrentPg={setCurrentPg} />
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <div>
          <table className="border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
                <th className="border border-gray-300 bg-gray-200 p-2">Card Number</th>
                <th className="border border-gray-300 bg-gray-200 p-2">Name</th>
                <th className="border border-gray-300 bg-gray-200 p-2">Pancard Number</th>
                <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
                <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
              </tr>
            </thead>

            {/* Suspense for Lazy Loading */}
            <Suspense fallback={<tr><td colSpan="6" className="text-center p-4">Loading Data...</td></tr>}>
              <TableBody userData={userData} />
            </Suspense>
          </table>
        </div>
      )}
    </>
  );
}

export default AUStable;

   