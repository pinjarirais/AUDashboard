import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import AuthLayout from "./authlayout";
import Login from "../pages/login/login";

function Layout() {
  return (
    <>
      <BrowserRouter>
        <div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default Layout;
