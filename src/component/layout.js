import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import AuthLayout from "./authlayout";
import Login from "../pages/login/login";
import Details from "../pages/details";
import UserForms from "../pages/userForms";
import UploadData from "../pages/login/uploaddata";
import CardDetails from "./cardDetails/cardDetails";
import ChangePin from "./userforms/ChangePin";
import EditProfile from "./userforms/EditProfile";
import PreventBackNavigation from "../hooks/PreventBackNavigation";

function Layout() {
  return (
    <>
      <BrowserRouter>
      <PreventBackNavigation />
        <div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/details" element={<Details />} /> */}
                {/* <Route path="/userForms" element={<UserForms />} /> */}
                <Route path="/uploaddata" element={<UploadData />} />
                <Route path="/cardDetails/:id" element={<CardDetails />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/ChangePin" element={<ChangePin />} />
              </Route>
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default Layout;
