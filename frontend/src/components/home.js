// src/components/Home.js
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const Home = () => {
  const [userId, setUserId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [showWebcam, setShowWebcam] = useState(false); // New state to control webcam visibility
  const webcamRef = useRef(null);

  // This function will be called when user clicks 'Capture & Register' or 'Capture & Login'
  const handleCaptureAndSend = async (action) => {
    // Ensure webcam is active and has a screenshot
    if (!webcamRef.current || !webcamRef.current.getScreenshot()) {
      alert("Please ensure the camera is active and ready to capture.");
      return;
    }

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
    formData.append("user_address", userAddress);

    const endpoint = action === "register" ? "/register" : "/login";
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error or server unavailable.");
    } finally {
      setShowWebcam(false); // Hide webcam after the action attempt
    }
  };

  // This function will be called when user clicks 'Register' or 'Login' (to show camera)
  const handleShowCameraButtonClick = () => {
    // Only show webcam if all fields are filled
    if (!userId || !userAddress) {
      alert("Please enter both User ID and Ethereum Address first.");
      return;
    }
    setShowWebcam(true); // Activate the webcam
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Blockchain-Based MFA</h1>
      <p style={styles.subheading}>Register or Login using your face!</p>

      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="User ID"
          style={styles.input}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ethereum Address"
          style={styles.input}
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />

        {showWebcam && ( // Conditionally render webcam
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.webcam}
            videoConstraints={{ facingMode: "user" }} // Use front camera
          />
        )}

        <div style={styles.buttonContainer}>
          {!showWebcam && ( // Show "Show Camera" buttons only if webcam is hidden
            <button
              onClick={handleShowCameraButtonClick}
              style={styles.button}
            >
              Show Camera
            </button>
          )}

          {showWebcam && ( // Show "Capture & Action" buttons only if webcam is visible
            <>
              <button
                onClick={() => handleCaptureAndSend("register")}
                style={styles.button}
              >
                Capture & Register
              </button>
              <button
                onClick={() => handleCaptureAndSend("login")}
                style={styles.button}
              >
                Capture & Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Basic inline styles (consider moving to a CSS module or file for better organization)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 60px)", // Adjusted for navbar height
    backgroundColor: "#f0f0f0",
    paddingTop: '80px', // Add padding to account for fixed navbar
    paddingBottom: '20px' // Add some space at the bottom
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#333",
  },
  subheading: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#555",
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "calc(100% - 24px)", // Adjust for padding + border
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  webcam: {
    width: "100%",
    height: "auto", // Maintain aspect ratio
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: 'wrap', // Allow buttons to wrap to next line on smaller screens
  },
  button: {
    flex: 1, // Allow buttons to take equal space
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    minWidth: '150px', // Ensure buttons are not too narrow
    transition: 'background-color 0.3s ease',
  },
};

export default Home;