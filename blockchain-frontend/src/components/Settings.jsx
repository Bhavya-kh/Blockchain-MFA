// // src/components/Settings.jsx
// import React, { useState } from "react";

// const Settings = () => {
//   const [userAddress, setUserAddress] = useState("");
//   const [message, setMessage] = useState("");

//   const handleDeleteAccount = async () => {
//     setMessage(""); // Clear previous messages

//     if (!userAddress) {
//       setMessage("Please enter your Ethereum Address to proceed with deletion.");
//       alert("Please enter your Ethereum Address to proceed with deletion.");
//       return;
//     }

//     // Confirmation dialog for irreversible action
//     if (!window.confirm(`Are you sure you want to delete the account associated with address: ${userAddress}? This action cannot be undone.`)) {
//       return; // User cancelled the deletion
//     }

//     const formData = new FormData();
//     formData.append("user_address", userAddress);

//     try {
//       const response = await fetch(`http://localhost:5000/delete`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || "Account deleted successfully!");
//         alert(data.message || "Account deleted successfully!");
//         setUserAddress(""); // Clear input on successful deletion
//       } else {
//         setMessage(data.error || data.message || "An error occurred during deletion.");
//         alert(data.error || data.message || "An error occurred during deletion.");
//       }
//     } catch (error) {
//       console.error("Error during API call:", error);
//       setMessage("Failed to connect to the backend or a network error occurred. Please ensure Flask is running.");
//       alert("Failed to connect to the backend. Please ensure it's running.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 pt-16 flex flex-col items-center justify-center">
//       <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">Account Settings</h1>
//       <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6">
//         <h2 className="text-2xl font-semibold text-red-400 text-center">Delete Your Profile</h2>
//         <p className="text-gray-300 text-sm text-center leading-relaxed">
//           Enter your Ethereum address to permanently delete your account and associated data from the system.
//           <br />
//           <strong className="text-red-300">This action is irreversible.</strong>
//         </p>

//         {message && (
//           <div
//             className={`p-4 rounded-lg text-sm font-medium shadow-sm ${
//               message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
//                 ? "bg-red-50 text-red-700 border border-red-200"
//                 : "bg-green-50 text-green-700 border border-green-200"
//             }`}
//           >
//             <div className="flex items-center">
//               <span className="mr-2">
//                 {message.includes("Failed") || message.includes("error") || message.includes("Error") || message.includes("denied")
//                   ? "⚠️"
//                   : "✅"}
//               </span>
//               {message}
//             </div>
//           </div>
//         )}

//         <input
//           type="text"
//           placeholder="Your Ethereum Address (e.g., 0x...)"
//           className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
//           onChange={(e) => setUserAddress(e.target.value)}
//           value={userAddress}
//         />
//         <button
//           onClick={handleDeleteAccount}
//           className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg border border-red-500/30"
//         >
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Settings;



// src/components/Settings.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Import ethers

const Settings = () => {
  const [userAddress, setUserAddress] = useState(""); // Connected Ethereum address
  const [message, setMessage] = useState("");

  // Ethers state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
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

          window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length > 0) {
              initEthers();
            } else {
              setIsConnected(false);
              setUserAddress("");
              setSigner(null);
              setMessage("MetaMask disconnected. Please connect your wallet.");
            }
          });
          window.ethereum.on('chainChanged', (chainId) => {
            initEthers();
            setMessage(`Chain changed to ${chainId}. Please ensure it's your local network.`);
          });

        } catch (error) {
          console.error("Error initializing ethers in Settings:", error);
          setMessage("Failed to connect to MetaMask. Please ensure it's installed and unlocked.");
        }
      } else {
        setMessage("MetaMask is not installed. Please install it to use this application.");
      }
    };

    initEthers();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initEthers);
        window.ethereum.removeListener('chainChanged', initEthers);
      }
    };
  }, []);

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

  const handleDeleteAccount = async () => {
    setMessage(""); // Clear previous messages
    if (!isConnected || !userAddress) {
      setMessage("Please connect your MetaMask wallet first.");
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    // Confirmation dialog for irreversible action
    if (!window.confirm(`Are you sure you want to delete the account associated with address: ${userAddress}? This action cannot be undone.`)) {
        return; // User cancelled the deletion
    }

    const formData = new FormData();
    formData.append("user_address", userAddress); // Send the connected address to Flask

    try {
      setMessage("Sending delete request to backend...");
      const response = await fetch(`http://localhost:5000/delete`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Account deleted successfully!");
        alert(data.message || "Account deleted successfully!");
        // Optionally, reset wallet connection state here if deleting the current connected account
        setUserAddress("");
        setIsConnected(false);
      } else {
        setMessage(data.error || data.message || "An error occurred during deletion.");
        alert(data.error || data.message || "An error occurred during deletion.");
      }
    } catch (error) {
      console.error("API call error:", error);
      setMessage(`Failed to connect to backend or network error: ${error.message}`);
      alert(`Failed to connect to backend or network error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 pt-16 flex flex-col items-center justify-center">
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">Account Settings</h1>
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-red-400 text-center">Delete Your Profile</h2>
        <p className="text-gray-300 text-sm text-center leading-relaxed">
          Your connected Ethereum address will be used to identify your account for deletion.
          <br />
          <strong className="text-red-300">This action is irreversible.</strong>
        </p>

        {message && (
            <div
                className={`p-4 rounded-lg text-sm font-medium shadow-sm ${
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
                <input
                    type="text"
                    placeholder="Your Ethereum Address"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                    value={userAddress} // This is populated by wallet connection
                    readOnly // Make it read-only
                />
                <button
                    onClick={handleDeleteAccount}
                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg border border-red-500/30"
                >
                    Delete Account
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default Settings;