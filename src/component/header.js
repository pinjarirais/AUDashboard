import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImg from "../imgs/AU-Bank-logo.png";
import profileIcon from "../imgs/profile.png";
import dropdownImg from "../imgs/arrow-down-sign-to-navigate.png";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [pfname, setPfname] = useState("");
  const [pfemail, setPfemail] = useState("");


  const updateProfileData = () => {
    setPfname(JSON.parse(localStorage.getItem("profilename")) || "");
    setPfemail(JSON.parse(localStorage.getItem("profilemail")) || "");
  };


  useEffect(() => {
    updateProfileData();

    //  Listen for updates when login occurs
    const handleProfileUpdate = () => updateProfileData();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);


  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilename");
    localStorage.removeItem("profilemail");

    
    window.dispatchEvent(new Event("profileUpdated"));

    navigate("/");
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
   console.log("pfname",pfname)
  return (
    <div className="px-10 flex flex-auto justify-between items-center border-b-[1px] border-[#6d3078]">
      <div className="logo-wrap">
        <Link to={"/dashboard"}>
          <img src={logoImg} className="w-[80px]" alt="logo" />
        </Link>
      </div>

      <div>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-md"
          >
            <img src={profileIcon} alt="Profile" className="w-8 h-8 rounded-full" />
            <span>{pfname}</span>
            <img src={dropdownImg} className="w-[10px]" alt="dropdownImg" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-10">
              <div className="p-3 border-b border-gray-200 break-words">
                <p className="text-gray-700 font-semibold">{pfname}</p>
                <p className="text-[0.8rem] text-wrap text-gray-500">{pfemail}</p>
              </div>
              <button
                onClick={clearSession}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;