import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/url";

const CustomFieldDataTable = () => {
  const [formData, setFormData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/increment/customfielddata`, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        });
        setFormData(response.data.data); 
      } catch (error) {
        console.error("Error fetching formData:", error);
      }
    };

    fetchFormData();
  }, [userDetails.token]);

  const deleteFormData = async (formDataId) => {
    try {
      await axios.delete(`${BASE_URL}/customfielddata/${formDataId}`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      });
      setFormData(formData.filter((data) => data._id !== formDataId));
    } catch (error) {
      console.error("Error deleting form data:", error);
    }
  };

  const viewFormDataDetails = (formDataId) => {
    navigate(`/admin/user/${formDataId}`);
  };

  



  
  return (
    <div className="md:ml-64 p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">All Form Field Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-r">ID</th>
              <th className="py-2 px-4 border-b border-r">Salutation</th>
              <th className="py-2 px-4 border-b border-r">Last Name</th>
              <th className="py-2 px-4 border-b border-r">Email</th>
              <th className="py-2 px-4 border-b border-r">Phone</th>
              <th className="py-2 px-4 border-b border-r">Message</th>
              <th className="py-2 px-4 border-b border-r">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((data) => (
              <tr key={data._id} className="text-center" >
                <td className="py-2 px-4 border-b border-r">{data._id}</td>
                <td className="py-2 px-4 border-b border-r">{data.salutation}</td>
                <td className="py-2 px-4 border-b border-r">{data.email}</td>
                <td className="py-2 px-4 border-b border-r">{data.phoneNumber}</td>
                <td className="py-2 px-4 border-b border-r flex justify-center gap-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => deleteFormData(data._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => viewFormDataDetails(data._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomFieldDataTable;
