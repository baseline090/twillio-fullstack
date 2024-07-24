import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaPhone,
  FaSms,
  FaHistory,
  FaFacebookMessenger,
  FaUser,
} from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
{
  /* <FaUserCircle />; */
}

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">PH-Dialer</h1>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <nav className="mt-4">
        <Link
          to="/sms"
          className="flex items-center my-4 px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <FaFacebookMessenger className="mr-3" />
          SMS
        </Link>
        <Link
          to="/call"
          className="flex items-center my-4 px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <FaPhone className="mr-3" /> Call
        </Link>
        <Link
          to="/history"
          className="flex items-center my-4 px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <FaSms className="mr-3" /> History
        </Link>
        {/* <Link
          to="/contacts"
          className="flex items-center my-4 px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <FaHistory className="mr-3" /> Contacts
        </Link> */}
        {userDetails.user.role == "admin" && (
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <FaUser className="mr-3" /> Admin
          </Link>
        )}

         {/* <Link
          to="/contacts"
          className="flex items-center my-4 px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <FaHistory className="mr-3" /> Contacts
        </Link> */}
        {userDetails.user.role == "admin" && (
          <Link
            to="/admin/upload"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <FaUser className="mr-3" /> Upload
          </Link>
        )}

{userDetails.user.role == "admin" && (
          <Link
            to="/admin/BulkEmail/List"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <FaUser className="mr-3" /> BulkEmail List
          </Link>
        )}

{userDetails.user.role == "admin" && (
          <Link
            to="/admin/BulkEmailDaily/List"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <FaUser className="mr-3" /> BulkEmail Daily List
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
