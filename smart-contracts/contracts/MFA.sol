
// pragma solidity ^0.8.0;

// contract MFA {
//     struct User {
//         address userAddress;
//         bytes32 userIdHash; // Hash of user ID or public key
//         string ipfsHash;    // IPFS hash for facial embedding
//         bool isAuthenticated;
//     }

//     mapping(address => User) public users;
//     event UserRegistered(address indexed userAddress, bytes32 userIdHash, string ipfsHash);
//     event AuthenticationStatus(address indexed userAddress, bool status);

//     function registerUser(bytes32 userIdHash, string memory ipfsHash) external {
//         require(users[msg.sender].userAddress == address(0), "User already registered");
//         users[msg.sender] = User({
//             userAddress: msg.sender,
//             userIdHash: userIdHash,
//             ipfsHash: ipfsHash,
//             isAuthenticated: false
//         });
//         emit UserRegistered(msg.sender, userIdHash, ipfsHash);
//     }

//     function updateAuthenticationStatus(bool status) external {
//         require(users[msg.sender].userAddress != address(0), "User not registered");
//         users[msg.sender].isAuthenticated = status;
//         emit AuthenticationStatus(msg.sender, status);
//     }

//     function getAuthenticationStatus(address userAddress) external view returns (bool) {
//         return users[userAddress].isAuthenticated;
//     }
// }


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MFA {
    struct User {
        address userAddress;
        bytes32 userIdHash; // Hash of user ID or public key
        string ipfsHash;       // IPFS hash for facial embedding
        bool isAuthenticated;
    }

    mapping(address => User) public users;
    event UserRegistered(address indexed userAddress, bytes32 userIdHash, string ipfsHash);
    event AuthenticationStatus(address indexed userAddress, bool status);
    event UserDeleted(address indexed userAddress);

    function registerUser(bytes32 userIdHash, string memory ipfsHash) external {
        require(users[msg.sender].userAddress == address(0), "User already registered");
        users[msg.sender] = User({
            userAddress: msg.sender,
            userIdHash: userIdHash,
            ipfsHash: ipfsHash,
            isAuthenticated: false
        });
        emit UserRegistered(msg.sender, userIdHash, ipfsHash);
    }

    function updateAuthenticationStatus(bool status) external {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        users[msg.sender].isAuthenticated = status;
        emit AuthenticationStatus(msg.sender, status);
    }

    function getAuthenticationStatus(address userAddress) external view returns (bool) {
        return users[userAddress].isAuthenticated;
    }

    function deleteUser() external {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        delete users[msg.sender];
        emit UserDeleted(msg.sender);
    }
}



