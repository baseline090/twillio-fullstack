// AdminPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/url";

const BulkEmailList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    if (!userDetails || !userDetails.user || userDetails.user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.token) {
      // Fetch all users   /admin/dailybulkemail
      axios
        .get(`${BASE_URL}/api/v1/admin/dailybulkemail`, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then((response) => {
          console.log(response, "aaaaaaaaaaaaaaaaaaaaaaa");
          setUsers(response.data.users);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [userDetails]);

  const deleteUser = (userId) => {
    if (userDetails && userDetails.token) {
      // Delete user request
      axios
        .delete(`${BASE_URL}/api/v1/admin/user/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then((response) => {
          setUsers(users.filter((user) => user._id !== userId));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const viewUserDetails = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="md:ml-64 p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Daily Bulk Email</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-r">Name</th>
              <th className="py-2 px-4 border-b border-r">Email</th>
              {/* <th className="py-2 px-4 border-b border-r">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b border-r">{user.name}</td>
                <td className="py-2 px-4 border-b border-r">{user.email}</td>
                {/* <td className="py-2 px-4 border-b border-r flex justify-center gap-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => viewUserDetails(user._id)}
                  >
                    View Details
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkEmailList;
