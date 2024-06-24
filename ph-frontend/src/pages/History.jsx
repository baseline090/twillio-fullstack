import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/url";
import toast from "react-hot-toast";

const History = () => {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [calls, setCalls] = useState([]);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audioInstances, setAudioInstances] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/allMyMessages`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages.");
      } finally {
        setLoadingMessages(false);
      }
    };
    const fetchCalls = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/calls`, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        });
        setCalls(response.data.calls);
      } catch (error) {
        console.error("Error fetching calls:", error);
        toast.error("Failed to fetch calls.");
      } finally {
        setLoadingCalls(false);
      }
    };
    const fetchReplies = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/allMyReplies`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        console.log("reps", response.data);
        setReplies(response.data);
      } catch (error) {
        console.error("Error fetching replies:", error);
        toast.error("Failed to fetch replies.");
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchMessages();
    fetchReplies();
    fetchCalls();
  }, []);

  const handleReplyClick = (from) => {
    console.log("object", from);
    setReplyTo(from);
    setIsModalOpen(true);
  };
  const removeCountryCode = (phoneNumber) => {
    if (phoneNumber.startsWith("+1")) {
      return phoneNumber.slice(2);
    }
    return phoneNumber;
  };
  const handleSendReply = async () => {
    if (!replyMessage) {
      toast.error("Please enter a reply message.");
      return;
    }

    const parsedMessages = [
      { phoneNumber: removeCountryCode(replyTo), parsedMessage: replyMessage },
    ];
    console.log("parsed is", parsedMessages);
    setIsSendingReply(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/sendmessage`,
        {
          messages: parsedMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      toast.success("Reply sent successfully!");
      setIsSendingReply(false);

      setIsModalOpen(false);
      setReplyMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply.");
      setIsSendingReply(false);
    }
  };
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

  return (
    <div className="mx-auto  p-4 mt-20 md:ml-72">
      <h1 className="text-2xl font-bold mb-4">SMS History</h1>
      {loadingMessages ? (
        <p>Loading messages...</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">My Sent Messages</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              {messages.length > 0 && (
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b border-r w-24">From</th>
                    <th className="px-4 py-2 border-b border-r w-24">To</th>
                    <th className="px-4 py-2 border-b border-r w-full">
                      Message
                    </th>
                    <th className="px-4 py-2 border-b border-r w-24">Status</th>
                  </tr>
                </thead>
              )}

              <tbody>
                {messages.length == 0 ? (
                  <h1>No messages sent</h1>
                ) : (
                  messages.map((message, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b border-r">
                        {message.from}
                      </td>
                      <td className="px-4 py-2 border-b border-r">
                        {message.to}
                      </td>
                      <td className="px-4 py-2 border-b border-r">
                        {message.body}
                      </td>
                      <td className="px-4 py-2 border-b border-r">
                        {message.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loadingReplies ? (
        <p>Loading replies...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Replies</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b w-24">From</th>
                  <th className="px-4 py-2 border-b w-24">To</th>
                  <th className="px-4 py-2 border-b w-full">Message</th>
                  <th className="px-4 py-2 border-b w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {replies.map((reply, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{reply.From}</td>
                    <td className="px-4 py-2 border-b">{reply.To}</td>
                    <td className="px-4 py-2 border-b">{reply.Body}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleReplyClick(reply.From)}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {loadingCalls ? (
        <p>Loading calls...</p>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Call History</h2>
          <div className="overflow-x-auto">
            {calls.length == 0 ? (
              <h1>You have not made any call yet</h1>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b w-24 border-r text-left">
                      From
                    </th>
                    <th className="px-4 py-2 border-b w-24 border-r text-left">
                      To
                    </th>
                    <th className="px-4 py-2 border-b w-24 border-r text-left">
                      Status
                    </th>{" "}
                    <th className="px-4 py-2 border-b w-24 border-r text-left">
                      Recording
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b border-r text-left">
                        {call.from}
                      </td>
                      <td className="px-4 py-2 border-b border-r text-left">
                        {call.to}
                      </td>
                      <td className="px-4 py-2 border-b border-r text-left">
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
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reply to {replyTo}
                </h3>
                <div className="mt-2">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply message here..."
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none h-32 p-2"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSendReply}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    {isSendingReply ? (
                      <span>Sending...</span>
                    ) : (
                      <span>Send Reply</span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
