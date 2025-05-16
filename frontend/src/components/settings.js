// src/components/Settings.js
import React, { useState } from "react";

const Settings = () => {
  const [userAddress, setUserAddress] = useState("");

  const handleDeleteAccount = async () => {
    if (!userAddress) {
      alert("Please provide your Ethereum address to delete your account.");
      return;
    }

    // Confirmation dialog for irreversible action
    if (!window.confirm(`Are you sure you want to delete the account associated with address: ${userAddress}? This action cannot be undone.`)) {
        return; // User cancelled the deletion
    }

    const formData = new FormData();
    formData.append("user_address", userAddress); // Append userAddress to FormData

    try {
      const response = await fetch("http://localhost:5000/delete", {
        method: "POST",
        body: formData, // Send FormData
      });
      const data = await response.json();
      alert(data.message || data.error);
      if (response.ok) {
        setUserAddress(""); // Clear input on successful deletion
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error or server unavailable.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Account Settings</h1>
      <div style={styles.formContainer}>
        <h2 style={styles.subHeading}>Delete Your Profile</h2>
        <p style={styles.instructionText}>
          Enter your Ethereum address to permanently delete your account and associated data from the system.
          **This action is irreversible.**
        </p>
        <input
          type="text"
          placeholder="Your Ethereum Address"
          style={styles.input}
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button
          onClick={handleDeleteAccount}
          style={styles.deleteButton}
        >
          Delete Account
        </button>
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
    marginBottom: "30px",
    color: "#333",
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
  subHeading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#e74c3c", // Red for deletion warning
  },
  instructionText: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "20px",
    lineHeight: '1.5',
    textAlign: 'center',
  },
  input: {
    width: "calc(100% - 24px)", // Adjust for padding + border
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  deleteButton: {
    padding: "12px 20px",
    backgroundColor: "#dc3545", // Bootstrap's danger red
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: 'background-color 0.3s ease',
  },
};

export default Settings;