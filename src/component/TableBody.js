import React from "react";
import { Link } from "react-router-dom";
import { MaskNumber, PhoneNumber } from "../hooks/MaskNumber";

function TableBody({ userData }) {
  return (
    <tbody>
      {userData?.chUsers?.map((item) => (
        <tr key={item.id}>
          <td className="border border-gray-300 p-2">{item.id}</td>
          <td className="border border-gray-300 p-2">
            <MaskNumber CardNumber={item?.cardHolders?.[0]?.cardNumber} />
          </td>
          <td className="border border-gray-300 p-2">
            <Link className="text-blue-700 underline" to={`/cardDetails/${item.id}`}>
              {item.name}
            </Link>
          </td>
          <td className="border border-gray-300 p-2">
            {item?.cardHolders?.[0]?.pancardNumber}
          </td>
          <td className="border border-gray-300 p-2">{item.email}</td>
          <td className="border border-gray-300 p-2">
            <PhoneNumber PhoneNumber={item.phone} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;


    
