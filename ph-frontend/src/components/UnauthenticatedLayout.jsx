import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

const UnauthenticatedLayout = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default UnauthenticatedLayout;
