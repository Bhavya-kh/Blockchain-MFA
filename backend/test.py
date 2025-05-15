import requests
import os

# IPFS API URL
IPFS_API_URL = "http://127.0.0.1:5001/api/v0"

def upload_to_ipfs(file_path):
    """
    Uploads a file to IPFS and returns the CID (Content Identifier).
    """
    try:
        with open(file_path, "rb") as file:
            files = {"file": file}
            response = requests.post(f"{IPFS_API_URL}/add", files=files)
            response.raise_for_status()  # Raise an error for bad responses
            ipfs_data = response.json()
            cid = ipfs_data["Hash"]
            print(f"File uploaded successfully. CID: {cid}")
            return cid
    except Exception as e:
        print(f"Failed to upload to IPFS: {e}")
        return None


def download_from_ipfs(cid, output_path):
    """
    Downloads a file from IPFS using its CID.
    """
    try:
        response = requests.post(f"{IPFS_API_URL}/cat?arg={cid}")
        response.raise_for_status()  # Raise an error for bad responses
        with open(output_path, "wb") as file:
            file.write(response.content)
        print(f"File downloaded successfully from IPFS. Saved to: {output_path}")
    except Exception as e:
        print(f"Failed to download from IPFS: {e}")


def test_ipfs():
    """
    Tests IPFS by uploading a sample file and downloading it back.
    """
    # Path to a sample file
    sample_file = "test.txt"
    downloaded_file = "downloaded_test.txt"

    # Create a sample file
    with open(sample_file, "w") as f:
        f.write("This is a test file for IPFS.")

    print(f"Created sample file: {sample_file}")

    # Step 1: Upload the file to IPFS
    cid = upload_to_ipfs(sample_file)
    if not cid:
        print("Upload failed. Exiting.")
        return

    # Step 2: Download the file from IPFS
    download_from_ipfs(cid, downloaded_file)

    # Step 3: Verify the integrity of the downloaded file
    if os.path.exists(downloaded_file):
        with open(sample_file, "r") as original, open(downloaded_file, "r") as downloaded:
            original_content = original.read()
            downloaded_content = downloaded.read()
            if original_content == downloaded_content:
                print("Test successful! Uploaded and downloaded files match.")
            else:
                print("Test failed! Uploaded and downloaded files do not match.")

    # Clean up temporary files
    os.remove(sample_file)
    os.remove(downloaded_file)
    print("Cleaned up temporary files.")


if __name__ == "__main__":
    test_ipfs()