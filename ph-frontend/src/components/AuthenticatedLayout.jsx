import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";

import Dialer from "../pages/Dialer";
import Sidebar from ".//Sidebar";
import SMS from "../pages/SMS";
import History from "../pages/History";
import AdminPage from "../pages/AdminPage";
import UserDetailsPage from "../pages/UserDetails";

const AuthenticatedLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/call" element={<Dialer />} />
            <Route path="/sms" element={<SMS />} />
            <Route path="/" element={<SMS />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/user/:id" element={<UserDetailsPage />} />
            {/* Add other authenticated routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
