// UploadForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/url";

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  useEffect(() => {
    if (userDetails.user.role != "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    // Fetch all users
    axios
      .get(`${BASE_URL}/api/v1/admin/allusers`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      })
      .then((response) => {
        const filteredUsers = response.data.users.filter(
          (user) => user.role === "user"
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const deleteUser = (userId) => {
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
  };

  const viewUserDetails = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        setMessage('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await axios.post(`${BASE_URL}/api/v1/admin/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            'Authorization': `Bearer ${userDetails.token}`
        });
        setMessage(res.data);
    }  catch (err) {
        if (err.response.status === 401) {
            // Handle 401 error (e.g., token expired)
            // Redirect to login page or refresh token
            setMessage('Unauthorized. Please log in again.');
            // Example: navigate('/login');
        } else {
            setMessage(err.response.data);
        }}
};

  return (
    <div className="md:ml-64 p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto">
      <h1>Upload Excel File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UploadForm;
