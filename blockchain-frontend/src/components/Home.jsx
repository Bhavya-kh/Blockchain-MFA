// // src/components/Home.jsx
// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";

// const Home = () => {
//   const [userId, setUserId] = useState("");
//   const [userAddress, setUserAddress] = useState("");
//   const [showWebcam, setShowWebcam] = useState(false); // Controls webcam visibility
//   const [message, setMessage] = useState(""); // For displaying messages/errors
//   const webcamRef = useRef(null);

//   // Function to handle capture and send data to backend (Register/Login)
//   const handleCaptureAndSend = async (action) => {
//     setMessage(""); // Clear previous messages

//     if (!userId || !userAddress) {
//       setMessage("Please enter both User ID and Ethereum Address to proceed.");
//       alert("Please enter both User ID and Ethereum Address to proceed.");
//       return;
//     }

//     if (!webcamRef.current || !webcamRef.current.getScreenshot()) {
//       setMessage("Failed to capture image. Please ensure the camera is active and ready.");
//       alert("Failed to capture image. Please ensure the camera is active and ready."); // Use alert for immediate user feedback
//       return;
//     }

//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) {
//       setMessage("Failed to capture image. Please try again.");
//       alert("Failed to capture image. Please try again.");
//       return;
//     }

//     // Convert base64 image to Blob
//     const base64Response = await fetch(imageSrc);
//     const blob = await base64Response.blob();

//     // Prepare FormData for the backend
//     const formData = new FormData();
//     formData.append("image", blob, "webcam-capture.jpg");
//     formData.append("user_id", userId);
//     formData.append("user_address", userAddress); // Send the user's Ethereum address

//     const endpoint = action === "register" ? "/register" : "/login";
//     try {
//       const response = await fetch(`http://localhost:5000${endpoint}`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || "Action successful!");
//         alert(data.message || "Action successful!"); // Show alert for success
//       } else {
//         setMessage(data.error || data.message || "An error occurred."); // Backend might send 'error' or 'message'
//         alert(data.error || data.message || "An error occurred."); // Show alert for error
//       }
//     } catch (error) {
//       console.error("Error during API call:", error);
//       setMessage("Failed to connect to the backend or a network error occurred. Please ensure Flask is running.");
//       alert("Failed to connect to the backend. Please ensure it's running.");
//     } finally {
//       setShowWebcam(false); // Hide webcam after action attempt, regardless of success/failure
//     }
//   };

//   // Function to display the webcam when Register/Login is initiated
//   const handleShowCameraButton = () => {
//     setMessage(""); // Clear previous messages
//     if (!userId || !userAddress) {
//       setMessage("Please enter both User ID and Ethereum Address to proceed.");
//       alert("Please enter both User ID and Ethereum Address to proceed.");
//       return;
//     }
//     setShowWebcam(true); // Activate the webcam
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 pt-16">
//       <div className="container mx-auto px-4 py-4 min-h-[calc(100vh-64px)] flex flex-col lg:flex-row lg:gap-8 justify-center items-center">
//         {/* Left Section - Header and Message */}
//         <div className="lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0">
//           <div className="text-center lg:text-left">
//             <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
//               Blockchain MFA
//             </h1>
//             <p className="text-xl text-gray-300">
//               Secure Authentication with Face Recognition Technology
//             </p>
//           </div>

//           {message && (
//             <div
//               className={`p-4 mt-6 rounded-lg text-sm font-medium shadow-sm ${
//                 message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
//                   ? "bg-red-50 text-red-700 border border-red-200"
//                   : "bg-green-50 text-green-700 border border-green-200"
//               }`}
//             >
//               <div className="flex items-center">
//                 <span className="mr-2">
//                   {message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
//                     ? "⚠️"
//                     : "✅"}
//                 </span>
//                 {message}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Section - Form and Camera */}
//         <div className="lg:w-1/2 bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-lg">
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
//                   User ID
//                 </label>
//                 <input
//                   id="userId"
//                   type="text"
//                   placeholder="Enter your user ID"
//                   className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
//                   onChange={(e) => setUserId(e.target.value)}
//                   value={userId}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="ethAddress" className="block text-sm font-medium text-white mb-2">
//                   Ethereum Address
//                 </label>
//                 <input
//                   id="ethAddress"
//                   type="text"
//                   placeholder="0x..."
//                   className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
//                   onChange={(e) => setUserAddress(e.target.value)}
//                   value={userAddress}
//                 />
//               </div>
//             </div>

//             <label className="block text-sm font-medium text-white mb-2">
//               Face Recognition Camera
//             </label>
//             <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-white/30">
//               {showWebcam && (
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   className="w-full h-auto"
//                   videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
//                 />
//               )}
//               {!showWebcam && (
//                 <div className="flex justify-center items-center h-64 text-white text-lg bg-gray-700">
//                   Click "Show Camera" to activate webcam
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-4 mt-4 flex-wrap">
//               {!showWebcam && (
//                 <button
//                   onClick={handleShowCameraButton}
//                   className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg border border-purple-400/30 min-w-[150px]"
//                 >
//                   Show Camera
//                 </button>
//               )}

//               {showWebcam && (
//                 <>
//                   <button
//                     onClick={() => handleCaptureAndSend("register")}
//                     className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg border border-blue-400/30 min-w-[150px]"
//                   >
//                     Register
//                   </button>
//                   <button
//                     onClick={() => handleCaptureAndSend("login")}
//                     className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg border border-green-400/30 min-w-[150px]"
//                   >
//                     Login
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// src/components/Home.jsx
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { ethers } from "ethers"; // Import ethers

const Home = () => {
  const [userId, setUserId] = useState("");
  const [userAddress, setUserAddress] = useState(""); // Connected Ethereum address
  const [showWebcam, setShowWebcam] = useState(false);
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);

  // Ethers state
  const [provider, setProvider] = useState(null); // Not strictly used for transactions, but good to have
  const [signer, setSigner] = useState(null);     // Used to get the address
  const [isConnected, setIsConnected] = useState(false);

  // Effect to initialize provider/signer/contract when component mounts or wallet changes
  useEffect(() => {
    const initEthers = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(browserProvider);

          const accounts = await browserProvider.listAccounts();
          if (accounts.length > 0) {
            const currentSigner = await browserProvider.getSigner();
            setSigner(currentSigner);
            setUserAddress(currentSigner.address);
            setIsConnected(true);
          } else {
            setIsConnected(false);
            setUserAddress("");
            setSigner(null);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length > 0) {
              initEthers(); // Re-initialize ethers on account change
            } else {
              // No accounts connected
              setIsConnected(false);
              setUserAddress("");
              setSigner(null);
              setMessage("MetaMask disconnected. Please connect your wallet.");
            }
          });

          // Listen for chain changes (optional, but good practice)
          window.ethereum.on('chainChanged', (chainId) => {
            initEthers(); // Re-initialize ethers on chain change
            setMessage(`Chain changed to ${chainId}. Please ensure it's your local network.`);
          });

        } catch (error) {
          console.error("Error initializing ethers:", error);
          setMessage("Failed to connect to MetaMask. Please ensure it's installed and unlocked.");
        }
      } else {
        setMessage("MetaMask is not installed. Please install it to use this application.");
      }
    };

    initEthers();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initEthers);
        window.ethereum.removeListener('chainChanged', initEthers);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const connectWallet = async () => {
    setMessage("");
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);
        const currentSigner = await browserProvider.getSigner();
        setSigner(currentSigner);
        setUserAddress(currentSigner.address);
        setIsConnected(true);
        setMessage("Wallet connected successfully!");
      } catch (error) {
        console.error("User denied account access or other error:", error);
        setMessage("Failed to connect wallet. User denied access or an error occurred.");
      }
    } else {
      setMessage("MetaMask is not installed. Please install it.");
    }
  };

  const handleCaptureAndSend = async (action) => {
    setMessage("");
    if (!isConnected || !userAddress) {
      setMessage("Please connect your MetaMask wallet first.");
      alert("Please connect your MetaMask wallet first.");
      return;
    }
    if (!userId) {
      setMessage("Please enter a User ID.");
      alert("Please enter a User ID.");
      return;
    }

    // Capture image from webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Failed to capture image. Please ensure the camera is active and ready.");
      alert("Failed to capture image. Please ensure the camera is active and ready.");
      return;
    }
    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();

    const formData = new FormData();
    formData.append("image", blob, "webcam-capture.jpg");
    formData.append("user_id", userId);
    formData.append("user_address", userAddress); // Send the connected address to Flask

    const endpoint = action === "register" ? "/register" : "/login";
    try {
      setMessage("Sending data to backend for processing...");
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Action successful!");
        alert(data.message || "Action successful!");
      } else {
        setMessage(data.error || data.message || "An error occurred on the backend.");
        alert(data.error || data.message || "An error occurred on the backend.");
      }
    } catch (error) {
      console.error("API call error:", error);
      setMessage(`Failed to connect to backend or network error: ${error.message}`);
      alert(`Failed to connect to backend or network error: ${error.message}`);
    } finally {
      setShowWebcam(false); // Hide webcam after action attempt
    }
  };

  const handleShowCameraButton = () => {
    setMessage("");
    if (!isConnected || !userAddress) {
      setMessage("Please connect your MetaMask wallet first.");
      alert("Please connect your MetaMask wallet first.");
      return;
    }
    if (!userId) {
      setMessage("Please enter a User ID to proceed.");
      alert("Please enter a User ID to proceed.");
      return;
    }
    setShowWebcam(true);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 pt-16">
      <div className="container mx-auto px-4 py-4 min-h-[calc(100vh-64px)] flex flex-col lg:flex-row lg:gap-8 justify-center items-center">
        {/* Left Section - Header and Message */}
        <div className="lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Blockchain MFA
            </h1>
            <p className="text-xl text-gray-300">
              Secure Authentication with Face Recognition Technology
            </p>
          </div>

          {message && (
            <div
              className={`p-4 mt-6 rounded-lg text-sm font-medium shadow-sm ${
                message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
                    ? "⚠️"
                    : "✅"}
                </span>
                {message}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Form and Camera */}
        <div className="lg:w-1/2 bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                  onChange={(e) => setUserId(e.target.value)}
                  value={userId}
                />
              </div>
              <div>
                <label htmlFor="ethAddress" className="block text-sm font-medium text-white mb-2">
                  Ethereum Address
                </label>
                <input
                  id="ethAddress"
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                  value={userAddress} // This is populated by wallet connection
                  readOnly // Make it read-only
                />
              </div>
            </div>

            {!isConnected && (
              <button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
              >
                Connect MetaMask
              </button>
            )}

            {isConnected && (
              <>
                <label className="block text-sm font-medium text-white mb-2">
                  Face Recognition Camera
                </label>
                <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-white/30">
                  {showWebcam && (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-auto"
                      videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                    />
                  )}
                  {!showWebcam && (
                      <div className="flex justify-center items-center h-64 text-white text-lg bg-gray-700">
                          Click "Show Camera" to activate webcam
                      </div>
                  )}
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                  {!showWebcam && (
                    <button
                      onClick={handleShowCameraButton}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg border border-purple-400/30 min-w-[150px]"
                    >
                      Show Camera
                    </button>
                  )}

                  {showWebcam && (
                    <>
                      <button
                        onClick={() => handleCaptureAndSend("register")}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg border border-blue-400/30 min-w-[150px]"
                      >
                        Register
                      </button>
                      <button
                        onClick={() => handleCaptureAndSend("login")}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg border border-green-400/30 min-w-[150px]"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;