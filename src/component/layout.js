import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import AuthLayout from "./authlayout";
import Login from "../pages/login/login";
import CardDetails from "./cardDetails/cardDetails";


function Layout() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen relative">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cardDetails" element={<CardDetails/>} />
              </Route>
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default Layout;
