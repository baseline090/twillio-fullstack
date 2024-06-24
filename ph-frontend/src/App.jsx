import React, { useEffect } from "react";
import { useAppContext } from "./AppContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import UnauthenticatedLayout from "./components/UnauthenticatedLayout";
import { BASE_URL } from "./utils/url";
import axios from "axios";

const App = () => {
  const { isLoggedIn, setisLoggedIn } = useAppContext();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  // const {  } = useAppContext();

  useEffect(() => {
    const getUserData = async () => {
      if (!userDetails) {
        setisLoggedIn(false);
        return;
      }
      if (userDetails.expiry < Date.now()) {
        setisLoggedIn(false);
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        });
        console.log("Loading user success:", response.data);
        setisLoggedIn(true);
        // toast.success('Template saved successfully');
      } catch (error) {
        console.error("Error Loading user :", error);
        setisLoggedIn(false);
        // toast.error(error.response.data.error);
      }
    };
    getUserData();
  }, []);
  return (
    <div>
      <Toaster
        toastOptions={{
          style: { background: "rgb(51 65 85)", color: "#fff" },
        }}
      />
      {isLoggedIn ? <AuthenticatedLayout /> : <UnauthenticatedLayout />}
    </div>
  );
};

export default App;
