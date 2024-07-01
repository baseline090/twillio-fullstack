import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/url";
import toast from "react-hot-toast";
import { useAppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const { setisLoggedIn, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, []);
  const resetFormData = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Enter all fields");
      return;
    }
    setIsLoadingLogin(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      console.log(result);
      // Handle response (e.g., store token, redirect, etc.)
      if (result.success) {
        toast.success("Login Successful");
        const expiry = Date.now() + 28 * 24 * 60 * 60 * 1000; // 24 hours expiry
        const userDataWithExpiry = { ...result, expiry };
        localStorage.setItem("userDetails", JSON.stringify(userDataWithExpiry));
        setisLoggedIn(true);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.password) {
      toast.error("Enter all fields");
      return;
    }
    setIsLoadingSignup(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      console.log(result, "result")
      // console.log("siiii", result);
      if (result.success) {
        toast.success("Signup Successful");
        const expiry = Date.now() + 28 * 24 * 60 * 60 * 1000; // 24 hours expiry
        const userDataWithExpiry = { ...result, expiry };
        localStorage.setItem("userDetails", JSON.stringify(userDataWithExpiry));
        setisLoggedIn(true);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoadingSignup(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <div className="md:w-1/2 p-6">
        <img src="/loginbgg.jpg" alt="Welcome" className="w-full h-auto" />
      </div>
      <div className="md:w-1/2 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>
        <form className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            {isLogin ? (
              <button
                onClick={handleLogin}
                disabled={isLoadingLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoadingLogin ? <Spinner /> : "Log In"}
              </button>
            ) : (
              <button
                onClick={handleSignup}
                disabled={isLoadingSignup}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoadingSignup ? <Spinner /> : "Signup"}
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={() => {
              setIsLogin(!isLogin);
              resetFormData();
            }}
          >
            {isLogin ? "Create an account" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
