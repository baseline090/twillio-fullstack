import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/url";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";

const Dialer = () => {
  const [dialNumber, setDialNumber] = useState("");
  const [incomingNumber, setIncomingNumber] = useState("");
  const callingToken = useRef(null);
  const device = useRef(null);
  const callInstance = useRef(null);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [showModal, setShowModal] = useState(false);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const ws = useRef(null);

  // useEffect(() => {
  //   ws.current = new WebSocket("ws://localhost:3000");

  //   ws.current.onopen = () => {
  //     console.log("WebSocket connection opened");
  //   };

  //   ws.current.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   ws.current.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("thedaata", data);
  //     if (data.token) {
  //       callingToken.current = data.token;
  //       initializeDevice(data.token);
  //     }
  //   };

  //   return () => {
  //     ws.current.close();
  //   };
  // }, []);
  const { isLoggedIn, setisLoggedIn } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    // Fetch authentication token from the server

    const fetchToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/token`, {
          // headers: {
          //   Authorization: `Bearer ${userDetails.token}`,
          // },
        });
        console.log("siuu", response.data);
        callingToken.current = response.data.token;
        initializeDevice(response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const initializeDevice = (token) => {
    device.current = new Device(token, {
      codecPreferences: ["opus", "pcmu"],
      logLevel: "DEBUG",
    });

    device.current.on("registered", () => {
      console.log("Device registered and ready to make and receive calls.");
    });

    device.current.on("error", (error) => {
      console.error("Twilio.Device Error: ", error.message);
    });

    device.current.on("incoming", handleIncomingCall);

    device.current.register();
  };

  const handleIncomingCall = async (call) => {
    setIncomingNumber("")
    setDialNumber("")
    setIncomingNumber(call.parameters.From);
    setShowIncomingCallModal(true);
    try {
      await axios.post(
        `${BASE_URL}/api/v1/saveCall`,
        {
          from: call.parameters.From,
          to: "+17542544520",
          sid: call.parameters.CallSid,
        },
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      console.log("Call information saved successfully.");
    } catch (error) {
      console.error("Error saving call information:", error);
    }

    callInstance.current = call;

    call.on("accept", () => {
      console.log("Incoming call accepted.");
      setShowIncomingCallModal(false);
      setShowModal(true);
    });

    call.on("disconnect", () => {
      console.log("Incoming call disconnected....!!");
      setShowIncomingCallModal(false);
      setShowModal(false);
    });

    call.on("cancel", () => {
      console.log("Incoming call canceled.");
      setShowIncomingCallModal(false);
      setShowModal(false);
    });
  };

  const handleCall = async () => {
    setIncomingNumber("")
    setDialNumber("")
    try {
      const params = { To: dialNumber };

      if (device.current) {
        const call = await device.current.connect({ params });
        callInstance.current = call;

        call.on("accept", async () => {
          console.log("Outgoing call accepted.", call);
          console.log("Outgoing call accepted.", call.parameters.CallSid);
          // callInstance.on("accept", () => {
          //   console.log({ callInstance });
          // });
          // callInstance.on("ringing", () => {});
          // callInstance.on("answered", () => {});
          // callInstance.on("connected", () => {});
          // callInstance.on("disconnect", () => {});
          // callInstance.on("cancel", () => {});
          try {
            await axios.post(
              `${BASE_URL}/api/v1/saveCall`,
              {
                from: "+17542544520",
                to: dialNumber,
                sid: call.parameters.CallSid,
              },
              {
                headers: {
                  Authorization: `Bearer ${userDetails.token}`,
                },
              }
            );
            console.log("Call information saved successfully.");
          } catch (error) {
            console.error("Error saving call information:", error);
          }
          setShowModal(true);
        });

        call.on("disconnect", () => {
          console.log("Outgoing call disconnected.", call);
          setShowModal(false);
        });

        call.on("cancel", () => {
          console.log("Outgoing call canceled.");
          setShowModal(false);
        });
      } else {
        throw new Error("Unable to make call");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const handleCall = async () => {
  //   try {
  //     device.current = new Device(callingToken.current, {
  //       // logLevel: 1,
  //       // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
  //       // providing better audio quality in restrained network conditions.
  //       codecPreferences: ["opus", "pcmu"],
  //     });
  //     // Device must be registered in order to receive incoming calls
  //     device.current.register();

  //     const params = {
  //       // get the phone number to call from the DOM
  //       // Record: true,

  //       To: dialNumber,
  //     };
  //     if (device.current) {
  //       const callInstance = await device.current.connect({ params });

  //       callInstance.on("accept", () => {
  //         console.log("accepted:", { callInstance });
  //       });
  //       callInstance.on("ringing", () => {
  //         console.log("rigning:", { callInstance });

  //         setShowModal(true);
  //       });
  //       callInstance.on("answered", () => {
  //         console.log("asnwering:", { callInstance });

  //         setShowModal(true);
  //       });
  //       callInstance.on("connected", () => {
  //         console.log("conected:", { callInstance });

  //         setShowModal(true);
  //       });
  //       callInstance.on("disconnect", () => {
  //         console.log("dissccc:", { callInstance });

  //         setShowModal(false);
  //       });
  //       callInstance.on("cancel", () => {
  //         console.log("cancleddd:", { callInstance });

  //         setShowModal(false);
  //       });
  //     } else {
  //       throw new Error("Unable to make call");
  //     }
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

  const handleHangup = () => {
    if (callInstance.current) {
      callInstance.current.disconnect();
      setShowModal(false);
    }
  };

  const handleAcceptIncomingCall = () => {
    if (callInstance.current) {
      callInstance.current.accept();
    }
  };

  const handleRejectIncomingCall = () => {
    if (callInstance.current) {
      callInstance.current.reject();
      setShowIncomingCallModal(false);
    }
  };

  const dialPadButtons = [
    { label: "1", sublabel: "" },
    { label: "2", sublabel: "ABC" },
    { label: "3", sublabel: "DEF" },
    { label: "4", sublabel: "GHI" },
    { label: "5", sublabel: "JKL" },
    { label: "6", sublabel: "MNO" },
    { label: "7", sublabel: "PQRS" },
    { label: "8", sublabel: "TUV" },
    { label: "9", sublabel: "WXYZ" },
    { label: "+", sublabel: "" },
    { label: "0", sublabel: "+" },
    { label: "#", sublabel: "" },
  ];

  const handleCallNumb = (digit) => {
    if (digit === "+" && dialNumber.includes("+")) {
      return;
    }
    setDialNumber(dialNumber + digit);
  };

  const handleDelete = () => {
    setDialNumber(dialNumber.slice(0, -1));
  };

  return (
    <div className="pt-16 h-screen mt-10 flex flex-col items-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Dialer</h1>
      </div>
      <div className="text-center mb-4">
        <input
          type="text"
          value={dialNumber}
          onChange={(e) => setDialNumber(e.target.value)}
          className="text-3xl font-bold bg-white p-2 rounded-md shadow-md"
          placeholder="Enter number"
        />
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-md font-bold"
          onClick={handleCall}
        >
          Call
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md text-center">
            <h2 className="text-2xl mb-4">
              On Call with {dialNumber && dialNumber}
              {incomingNumber && incomingNumber}
            </h2>
            <button
              onClick={handleHangup}
              className="bg-red-500 mx-auto w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-md font-bold"
            >
              Hangup
            </button>
          </div>
        </div>
      )}

      {showIncomingCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md text-center">
            <h2 className="text-2xl mb-4">
              Incoming Call from {incomingNumber}
            </h2>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleAcceptIncomingCall}
                className="bg-green-500 w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-md font-bold"
              >
                Accept
              </button>
              <button
                onClick={handleRejectIncomingCall}
                className="bg-red-500 w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-md font-bold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialer;
