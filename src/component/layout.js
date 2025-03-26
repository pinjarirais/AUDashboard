import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import AuthLayout from "./authlayout";
import Login from "../pages/login/login";
import UploadData from "../pages/login/uploaddata";
import CardDetails from "./cardDetails/cardDetails";
import ChangePin from "./userforms/ChangePin";
import EditProfile from "./userforms/EditProfile";
import PreventBackNavigation, { ClearStorageAndRedirect } from "../hooks/PreventBackNavigation";


function Layout() {
    const [chUserId, setChUserId] = useState('')
    // console.log("CH user ID >>>>",chUserId)
  return (
    <>
      <BrowserRouter>
      <PreventBackNavigation />
        <div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<ClearStorageAndRedirect />} />
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Dashboard setChUserId={setChUserId}/>} />
                {/* <Route path="/details" element={<Details />} /> */}
                {/* <Route path="/userForms" element={<UserForms />} /> */}
                <Route path="/uploaddata" element={<UploadData />} />
                <Route path="/cardDetails/:id" element={<CardDetails chUserId={chUserId} />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/ChangePin" element={<ChangePin />} />
                {/* <Route path="*" element={<ClearStorageAndRedirect />} /> */}
              </Route>
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default Layout;
