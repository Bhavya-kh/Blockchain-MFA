import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your deployed contract address
const contractABI = abi;

function App() {
  const [userId, setUserId] = useState("");
  const [userAddress, setUserAddress] = useState(""); // Ethereum address input
  const webcamRef = useRef(null);

  const handleCapture = async (action) => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Failed to capture image. Please try again.");
      return;
    }

    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();

    const formData = new FormData();
    formData.append("image", blob, "webcam-capture.jpg");
    formData.append("user_id", userId);
    formData.append("user_address", userAddress); // Ensure userAddress is included

    const endpoint = action === "register" ? "/register" : "/login";
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    alert(data.message || data.error);
  };

  const handleDeleteAccount = async () => {
    if (!userAddress) {
      alert("Please provide your Ethereum address.");
      return;
    }

    const formData = new FormData();
    formData.append("user_address", userAddress); // Append userAddress to FormData

    const response = await fetch("http://localhost:5000/delete", {
      method: "POST",
      body: formData, // Send FormData
    });
    const data = await response.json();
    alert(data.message || data.error);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Blockchain-Based MFA</h1>
      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="User ID"
          style={styles.input}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ethereum Address (optional)"
          style={styles.input}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={styles.webcam}
        />
        <div style={styles.buttonContainer}>
          <button
            onClick={() => handleCapture("register")}
            style={styles.button}
          >
            Register
          </button>
          <button
            onClick={() => handleCapture("login")}
            style={styles.button}
          >
            Login
          </button>
          <button
            onClick={handleDeleteAccount}
            style={{ ...styles.button, backgroundColor: "#dc3545" }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  webcam: {
    width: "100%",
    height: "200px",
    marginBottom: "15px",
    borderRadius: "4px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default App;