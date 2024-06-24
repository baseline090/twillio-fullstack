import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import toast from "react-hot-toast";
import { MdOutlineMenu } from "react-icons/md";
import Sidebar from "./Sidebar";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { isLoggedIn, setisLoggedIn } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  console.log("object", userDetails);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }; 

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-lg fixed w-full z-10">
        <div className="max-w-screen flex items-center justify-between mx-auto py-4 px-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-900 dark:text-white mr-4"
            >
              <MdOutlineMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-3">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                PH-Dialer
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex space-x-8">
                  <Link
                    // to="/profile"
                    className="py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <FaUserCircle className="inline-block mr-2" />
                    {userDetails.user.name}
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("userDetails");
                      setisLoggedIn(false);
                      toast.success("Logout Successfully!");
                      navigate("/");
                    }}
                    className="py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Navbar;
