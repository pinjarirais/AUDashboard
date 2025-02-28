import React from 'react'
import logoImg from '../imgs/AU-Bank-logo.png';
import profileIcon from '../imgs/profile.png';
import dropdownImg from '../imgs/arrow-down-sign-to-navigate.png';
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from './dataProvider';


function Header() {
  const { sharedData } = useData();
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const clearSession = ()=>{
    localStorage.clear("token")
    navigate("/")
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='px-10 flex flex-auto justify-between items-center border-b-[1px] border-[#6d3078] '>
      <div className='logo-wrap'>
        <Link to={"/dashboard"}><img src={logoImg} className='w-[80px]' alt='logo' /></Link>
      </div>

      <div>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-md"
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{sharedData.name}</span>
            <img src={dropdownImg} className='w-[10px]' alt='dropdownImg' />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
              <div className="p-3 border-b border-gray-200">
                <p className="text-gray-700 font-semibold">{sharedData.name}</p>
                <p className="text-sm text-gray-500">{sharedData.email}</p>
              </div>
              <button onClick={clearSession} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
