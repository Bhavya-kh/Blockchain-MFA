from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import face_recognition
import os
import hashlib
import numpy as np
from cryptography.fernet import Fernet
from web3 import Web3
import json
import base64

import ipfshttpclient

import requests

from cryptography.fernet import Fernet

# Generate or load the encryption key
# key = b'your-32-byte-base64-url-safe-key='  # Replace with your actual key
# cipher_suite = Fernet(key)

# print("Encryption Key:", key)

# IPFS API URL
IPFS_API_URL = "http://127.0.0.1:5001/api/v0"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Blockchain connection
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
with open("../shared/abi.json", "r") as f:
    contract_abi = json.load(f)
contract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Encryption key
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Folder to store facial embeddings
FACE_DATA_FOLDER = "face_data"
os.makedirs(FACE_DATA_FOLDER, exist_ok=True)




import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/register", methods=["POST"])
def register():
    image = request.files["image"]
    user_id = request.form["user_id"]
    user_address = request.form.get("user_address")  # Optional: Pass the Ethereum address from the frontend

    # If no Ethereum address is provided, use the first account as default
    if not user_address:
        user_address = w3.eth.accounts[0]
    else:
        user_address = Web3.to_checksum_address(user_address)  # Ensure the address is valid

    logging.debug(f"Registering user with ID: {user_id}, Ethereum Address: {user_address}")

    # Check if the user is already registered
    try:
        user_data = contract.functions.users(user_address).call()
        if user_data[0] != '0x0000000000000000000000000000000000000000':  # Check if userAddress is not zero
            logging.error("User already registered")
            return jsonify({"error": "User already registered"}), 400
    except Exception as e:
        logging.error(f"Failed to retrieve user data from the blockchain: {e}")
        return jsonify({"error": f"Blockchain error: {e}"}), 500

    # Save and encode the image temporarily
    temp_image_path = os.path.join(FACE_DATA_FOLDER, f"{user_id}.jpg")
    image.save(temp_image_path)
    known_image = face_recognition.load_image_file(temp_image_path)

    try:
        encoding = face_recognition.face_encodings(known_image)[0]
    except IndexError:
        logging.error("No face detected in the uploaded image")
        return jsonify({"error": "No face detected in the uploaded image"}), 400

    # Encrypt the encoding
    encrypted_encoding = cipher_suite.encrypt(encoding.tobytes())

    # Upload the encrypted encoding to IPFS
    try:
        files = {"file": ("encrypted_encoding.bin", encrypted_encoding)}
        response = requests.post(f"{IPFS_API_URL}/add", files=files)
        ipfs_data = response.json()
        ipfs_hash = ipfs_data["Hash"]  # CID of the uploaded file
        logging.debug(f"Uploaded to IPFS with hash: {ipfs_hash}")
    except Exception as e:
        logging.error(f"Failed to upload to IPFS: {e}")
        return jsonify({"error": f"Failed to upload to IPFS: {e}"}), 500

    # Generate a bytes32 hash
    user_id_hash_hex = hashlib.sha256(user_id.encode()).hexdigest()
    user_id_hash_bytes32 = Web3.to_bytes(hexstr=user_id_hash_hex)

    # Call the smart contract
    try:
        tx = contract.functions.registerUser(user_id_hash_bytes32, ipfs_hash).transact({"from": user_address})
        receipt = w3.eth.wait_for_transaction_receipt(tx)
        logging.debug(f"Transaction successful with hash: {receipt.transactionHash.hex()}")
    except Exception as e:
        logging.error(f"Transaction failed: {e}")
        return jsonify({"error": f"Transaction failed: {e}"}), 500

    # Clean up temporary file
    os.remove(temp_image_path)

    return jsonify({
        "message": "User registered successfully",
        "tx_hash": receipt.transactionHash.hex(),
        "ipfs_hash": ipfs_hash,
        "ethereum_address": user_address
    })




@app.route("/login", methods=["POST"])
def login():
    image = request.files["image"]
    user_id = request.form["user_id"]
    user_address = request.form.get("user_address")
    if not user_address:
        logging.error("Ethereum address is required for login")
        return jsonify({"error": "Ethereum address is required"}), 400
    try:
        user_address = Web3.to_checksum_address(user_address)
    except ValueError:
        logging.error(f"Invalid Ethereum address: {user_address}")
        return jsonify({"error": "Invalid Ethereum address"}), 400

    logging.debug(f"Logging in user with ID: {user_id}, Ethereum Address: {user_address}")

    # Retrieve the user data from the blockchain using the provided address
    try:
        user_data = contract.functions.users(user_address).call()
        if user_data[0] == '0x0000000000000000000000000000000000000000':
            logging.error(f"User not registered at address: {user_address}")
            return jsonify({"error": "User not registered"}), 404

        ipfs_hash = user_data[2]  # IPFS hash is at index 2
        if not ipfs_hash:
            logging.error("No IPFS hash found for the user")
            return jsonify({"error": "No IPFS hash found for the user"}), 404

        if isinstance(ipfs_hash, bytes):
            ipfs_hash = ipfs_hash.decode("utf-8")
        logging.debug(f"IPFS Hash Retrieved from Blockchain: {ipfs_hash}")
    except Exception as e:
        logging.error(f"Failed to retrieve user data from the blockchain: {e}")
        return jsonify({"error": f"Blockchain error: {e}"}), 500

    # Download and decrypt the encoding (rest of the login logic remains the same)
    try:
        response = requests.post(f"{IPFS_API_URL}/cat?arg={ipfs_hash}")
        encrypted_encoding = response.content
        logging.debug(f"Downloaded data from IPFS with hash: {ipfs_hash}")
        logging.debug(f"Encrypted Encoding (Base64): {base64.urlsafe_b64encode(encrypted_encoding).decode()}")
    except Exception as e:
        logging.error(f"Failed to retrieve from IPFS: {e}")
        return jsonify({"error": f"Failed to retrieve from IPFS: {e}"}), 500

    try:
        encoding = cipher_suite.decrypt(encrypted_encoding)
        logging.debug("Decryption successful")
    except Exception as e:
        logging.error(f"Decryption failed: {e}")
        return jsonify({"error": f"Decryption failed: {e}"}), 500

    known_encoding = np.frombuffer(encoding, dtype=np.float64)

    # Compare with the captured image (rest of the login logic remains the same)
    unknown_image = face_recognition.load_image_file(image)
    try:
        unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
    except IndexError:
        logging.error("No face detected in the uploaded image")
        return jsonify({"error": "No face detected in the uploaded image"}), 400

    result = face_recognition.compare_faces([known_encoding], unknown_encoding)[0]

    if result:
        try:
            tx = contract.functions.updateAuthenticationStatus(True).transact({"from": user_address})
            receipt = w3.eth.wait_for_transaction_receipt(tx)
            logging.debug(f"Login transaction successful with hash: {receipt.transactionHash.hex()}")
        except Exception as e:
            logging.error(f"Transaction failed: {e}")
            return jsonify({"error": f"Transaction failed: {e}"}), 500

        return jsonify({
            "message": "Login successful",
            "tx_hash": receipt.transactionHash.hex()
        })
    else:
        logging.error("Face comparison failed")
        return jsonify({"message": "Login failed"}), 401
    

@app.route("/delete", methods=["POST"])
def delete_user():
    user_address = request.form.get("user_address") # Get from form data
    if not user_address:
        logging.error("Ethereum address is required to delete user")
        return jsonify({"error": "Ethereum address is required"}), 400
    try:
        user_address = Web3.to_checksum_address(user_address)
    except ValueError:
        logging.error(f"Invalid Ethereum address: {user_address}")
        return jsonify({"error": "Invalid Ethereum address"}), 400

    logging.debug(f"Deleting user with Ethereum Address: {user_address}")

    # Check if the user is registered
    try:
        user_data = contract.functions.users(user_address).call()
        if user_data[0] == '0x0000000000000000000000000000000000000000':
            logging.error("User not registered")
            return jsonify({"error": "User not registered"}), 404
    except Exception as e:
        logging.error(f"Failed to retrieve user data from the blockchain: {e}")
        return jsonify({"error": f"Blockchain error: {e}"}), 500

    # Delete the user from the smart contract
    try:
        tx = contract.functions.deleteUser().transact({"from": user_address})
        receipt = w3.eth.wait_for_transaction_receipt(tx)
        logging.debug(f"User deletion transaction successful with hash: {receipt.transactionHash.hex()}")
    except Exception as e:
        logging.error(f"Transaction failed: {e}")
        return jsonify({"error": f"Transaction failed: {e}"}), 500

    return jsonify({
        "message": "User deleted successfully",
        "tx_hash": receipt.transactionHash.hex()
    })
    

if __name__ == "__main__":
    app.run(debug=True)