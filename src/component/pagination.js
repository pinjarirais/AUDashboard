import React from "react";

function Pagination({ pagenumber, setCurrentPg, currentpg, AUStotalLenght }) {
  
  const handlePagination = (index) => {
    console.log(index);
    setCurrentPg(index);
  };

  const handlePrevious = () => {
    if (currentpg > 0) {
      setCurrentPg(currentpg - 1);
    }
  };

  const handleNext = () => {
    if (currentpg < AUStotalLenght - 1) {
      setCurrentPg(currentpg + 1);
    }
  };

  return (
          <>
            <div className="pb-6 pt-2 flex">
              <button
                onClick={handlePrevious}
                disabled={currentpg === 0}
                className={`px-3 py-1 cursor-pointer rounded-md ${
                  currentpg === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-700 text-white"
                }`}
                >
                {"<"} Pre
              </button>
              <ul className="flex space-x-1 pl-4 pr-4">
                {pagenumber.map((item, index) => (
                  <li
                    key={index}
                    className={`px-3 cursor-pointer rounded-md ${
                      currentpg === index ? "bg-blue-700 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => handlePagination(index)}
                  >
                    {item + 1}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleNext}
                disabled={currentpg === AUStotalLenght - 1}
                className={`px-3 py-1 cursor-pointer rounded-md ${
                  currentpg === AUStotalLenght - 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-700 text-white"
                }`}
                >
                Next {">"}
              </button>
            </div>
          </>
        );
}

export default Pagination;
