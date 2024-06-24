import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/url";

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audioInstances, setAudioInstances] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/admin/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const getUserMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/admin/user/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const getUserCalls = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/admin/user/calls/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        console.log("ress", response);
        setCalls(response.data.calls);
      } catch (error) {
        console.error("Error fetching calls:", error);
      }
    };

    getUserDetails();
    getUserMessages();
    getUserCalls();
  }, [id]);
  const playRecording = async (callId, recordingUrl) => {
    try {
      const response = await axios.get(recordingUrl, {
        auth: {
          username: "AC6a4a543ba398052875d85ecb51e94093",
          password: "220001780ddc514f8c833a3054af0318",
        },
        responseType: "arraybuffer",
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener("ended", () => {
        setCurrentPlaying(null);
      });

      audioInstances[callId] = audio;
      setAudioInstances({ ...audioInstances });
      audio.play();
      setCurrentPlaying(callId);
    } catch (error) {
      console.error("Error while playing recording:", error);
      toast.error("Failed to play recording.");
    }
  };

  const handlePlayPauseClick = (callId, recordingUrl) => {
    console.log("call id", callId);
    if (currentPlaying === callId) {
      audioInstances[callId].pause();
      setCurrentPlaying(null);
    } else {
      if (currentPlaying) {
        audioInstances[currentPlaying].pause();
        audioInstances[currentPlaying].currentTime = 0;
      }

      if (!audioInstances[callId]) {
        playRecording(callId, recordingUrl);
      } else {
        audioInstances[callId].play();
        setCurrentPlaying(callId);
      }
    }
  };
  if (!user) {
    return <div className="md:ml-64 p-4">Loading...</div>;
  }

  return (
    <div className="md:ml-64 p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Name: {user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
      <h2 className="text-xl font-bold mt-6 mb-2">SMS History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left border-r">From</th>
              <th className="py-2 px-4 border-b text-left border-r">To</th>
              <th className="py-2 px-4 border-b w-full text-left border-r">
                Body
              </th>
              <th className="py-2 px-4 border-b text-left border-r">Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message._id}>
                <td className="py-2 px-4 border-b whitespace-nowrap border-r">
                  {message.from}
                </td>
                <td className="py-2 px-4 border-b whitespace-nowrap border-r">
                  {message.to}
                </td>
                <td className="py-2 px-4 border-b w-full border-r">
                  {message.body}
                </td>
                <td className="py-2 px-4 border-b whitespace-nowrap border-r">
                  {message.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-bold mt-6 mb-2">Call History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left border-r">Caller</th>
              <th className="py-2 px-4 border-b text-left border-r">
                Receiver
              </th>
              <th className="py-2 px-4 border-b w-full text-left border-r">
                Call Status
              </th>
              <th className="px-4 py-2 border-b w-24 border-r text-left">
                Recording
              </th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call._id}>
                <td className="py-2 px-4 border-b whitespace-nowrap border-r">
                  {call.from}
                </td>
                <td className="py-2 px-4 border-b whitespace-nowrap border-r">
                  {call.to}
                </td>
                <td className="py-2 px-4 border-b w-full border-r">
                  {call.status}
                </td>
                <td className="px-4 py-2 border-b border-r text-left">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      handlePlayPauseClick(call._id, call.recordingUrl)
                    }
                  >
                    {currentPlaying === call._id ? "Pause" : "Play"}
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

export default UserDetailsPage;
