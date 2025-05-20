// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import { ethers } from "ethers";
// import abi from "./abi.json";

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
// const contractABI = abi;

// function App() {
//   const [userId, setUserId] = useState("");
//   const [userAddress, setUserAddress] = useState(""); // Ethereum address input
//   const webcamRef = useRef(null);
//   const [message, setMessage] = useState(""); // For displaying messages/errors

//   const handleCapture = async (action) => {
//     setMessage(""); // Clear previous messages
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) {
//       alert("Failed to capture image. Please try again.");
//       setMessage("Failed to capture image. Please try again.");
//       return;
//     }

//     const base64Response = await fetch(imageSrc);
//     const blob = await base64Response.blob();

//     const formData = new FormData();
//     formData.append("image", blob, "webcam-capture.jpg");
//     formData.append("user_id", userId);
//     formData.append("user_address", userAddress);

//     const endpoint = action === "register" ? "/register" : "/login";
//     try {
//       const response = await fetch(`http://localhost:5000${endpoint}`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message || "Action successful!");
//         alert(data.message || "Action successful!");
//       } else {
//         setMessage(data.error || "An error occurred.");
//         alert(data.error || "An error occurred.");
//       }
//     } catch (error) {
//       console.error("Error during API call:", error);
//       setMessage("Failed to connect to the backend. Please ensure it's running.");
//       alert("Failed to connect to the backend. Please ensure it's running.");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     setMessage(""); // Clear previous messages
//     if (!userAddress) {
//       alert("Please provide your Ethereum address.");
//       setMessage("Please provide your Ethereum address.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("user_address", userAddress);

//     try {
//       const response = await fetch("http://localhost:5000/delete", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message || "Account deleted successfully!");
//         alert(data.message || "Account deleted successfully!");
//       } else {
//         setMessage(data.error || "An error occurred while deleting the account.");
//         alert(data.error || "An error occurred while deleting the account.");
//       }
//     } catch (error) {
//       console.error("Error during delete API call:", error);
//       setMessage("Failed to connect to the backend for deletion. Please ensure it's running.");
//       alert("Failed to connect to the backend for deletion. Please ensure it's running.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//       <div className="container mx-auto px-4 py-4 min-h-screen flex flex-col lg:flex-row lg:gap-8">
//         {/* Left Section - Header and Message */}
//         <div className="lg:w-1/2 flex flex-col justify-center">
//           <div className="text-center lg:text-left mb-8 lg:mb-0">
//             <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
//               Blockchain MFA
//             </h1>
//             <p className="text-xl text-gray-300">
//               Secure Authentication with Face Recognition Technology
//             </p>
//           </div>

//           {message && (
//             <div 
//               className={`p-4 mb-6 rounded-lg text-sm font-medium shadow-sm ${
//                 message.includes("Failed") || message.includes("error") || message.includes("Error")
//                   ? "bg-red-50 text-red-700 border border-red-200"
//                   : "bg-green-50 text-green-700 border border-green-200"
//               }`}
//             >
//               <div className="flex items-center">
//                 <span className="mr-2">
//                   {message.includes("Failed") || message.includes("error") || message.includes("Error")
//                     ? "⚠️"
//                     : "✅"}
//                 </span>
//                 {message}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Section - Form and Camera */}
//         <div className="lg:w-1/2 bg-white/10 backdrop-blur-md p-6 rounded-2xl">
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
//             <div>
//               <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-white/30">
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   className="w-full h-auto"
//                   videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
//                 />
//               </div>

//               <div className="flex gap-4 mt-4">
//                 <button
//                   onClick={() => handleCapture("register")}
//                   className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg border border-blue-400/30"
//                 >
//                   Register
//                 </button>
//                 <button
//                   onClick={() => handleCapture("login")}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg border border-green-400/30"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={handleDeleteAccount}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg border border-red-400/30"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Settings from "./components/Settings";

// No need for ethers or abi directly in this App.jsx anymore.

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar is rendered on every page */}
      <Routes>
        {/* Define routes for different pages */}
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;