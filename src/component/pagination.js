import React from "react";

function Pagination({ pagenumber, setCurrentPg, currentpg }) {
  const handlePagination = (index) => {
    console.log(index);
    setCurrentPg(index);
  };
  
  return (
    <>
      <div className="pb-6 pt-2">
        <ul className="flex space-x-1 ">
          {pagenumber.map((item, index) => (
            <li
              key={index}
              className={
                currentpg == index
                  ? "bg-blue-700 text-white px-3 cursor-pointer rounded-md"
                  : "px-3 cursor-pointer bg-gray-100 rounded-md"
              }
              onClick={() => handlePagination(index)}
            >
              {item + 1}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Pagination;
