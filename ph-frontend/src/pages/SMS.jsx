import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL, NEW_URL } from "../utils/url";
import Spinner from "../components/Spinner";

sgMail.setApiKey("YOUR_SENDGRID_API_KEY"); // Replace with your actual SendGrid API key

const SMSForm = () => {
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState({
    sms: false,
    whatsapp: false,
    email: false,
  });
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { salutation, firstName, lastName, email, phoneNumber, message } =
      formData;
    if (!salutation) return "Please select a salutation.";
    if (!firstName) return "Please enter a first name.";
    if (!lastName) return "Please enter a last name.";
    if (!email) return "Please enter an email address.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      return "Please enter a valid email address.";
    if (!phoneNumber) return "Please enter a phone number.";
    if (!message) return "Please enter a message.";
    return null;
  };

  const sendRequest = async (url, data, type) => {
    setLoading((prevLoading) => ({ ...prevLoading, [type]: true }));

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      });
      console.log("response", response);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} sent successfully!`
      );
      setFormData({
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      console.error(`Error sending ${type}:`, error);
      toast.error(`Failed to send ${type}.`);
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [type]: false }));
    }
  };

  const handleSend = async (type) => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    let { phoneNumber, salutation, lastName, message, email } = formData;
    let modifiedMessage;
    let url;
    let data;

    if (type === "sms") {
      modifiedMessage = `
Guten Tag ${salutation} ${lastName},

im Anhang finden Sie den Link zur Präsentation über die Kooperation mit dem SchadenNetzwerk von Justizcar:

External Link

Freundliche Grüße,
Ihr SchadenNetzwerk
`;
      if (!phoneNumber.startsWith("+49")) {
        phoneNumber = `+49${phoneNumber}`;
      }
      url = `${BASE_URL}/api/v1/user/sendmessage`;
      data = { messages: [{ phoneNumber, parsedMessage: modifiedMessage }] };
    } else if (type === "whatsapp") {
      if (!phoneNumber.startsWith("+49")) {
        phoneNumber = `+49${phoneNumber}`;
      }
      url = `${NEW_URL}/send-message`;
      data = { phoneNumber, salutation, lastName };
    } else if (type === "email") {
      url = `${NEW_URL}/send-email`;
      data = { email, salutation, lastName };
      // toast.success("Email sent successfully!");
      // setFormData({
      //   salutation: "",
      //   firstName: "",
      //   lastName: "",
      //   email: "",
      //   phoneNumber: "",
      //   message: "",
      // });
      // setLoading((prevLoading) => ({ ...prevLoading, email: false }));
    
    }

    await sendRequest(url, data, type);
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-32 bg-white shadow-md rounded-lg">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Send Message</h1>
      <form>
        <div className="flex justify-between">
          <div className="mb-4 w-[16%]">
            <label
              htmlFor="salutation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salutation
            </label>
            <select
              id="salutation"
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none p-2"
            >
              <option value="">Select</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
            </select>
          </div>
          <div className="mb-4 w-[80%]">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none p-2"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none p-2"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <div className="flex items-center border bg-gray-50 border-gray-300 rounded-md p-2">
            <span className="text-gray-500 mr-2">
              <span className="text-[18px] font-semibold">&#43;</span>49
            </span>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              className="flex-grow focus:outline-none bg-gray-50"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none h-32 p-2"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleSend("sms")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading.sms}
          >
            {loading.sms ? <Spinner /> : "Send SMS"}
          </button>
          <button
            type="button"
            onClick={() => handleSend("whatsapp")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading.whatsapp}
          >
            {loading.whatsapp ? <Spinner /> : "Send WhatsApp"}
          </button>
          <button
            type="button"
            onClick={() => handleSend("email")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading.email}
          >
            {loading.email ? <Spinner /> : "Send Email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SMSForm;
