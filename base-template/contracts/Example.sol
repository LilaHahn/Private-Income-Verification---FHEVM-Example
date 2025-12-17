// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Example Contract
/// @notice This is a template contract demonstrating FHEVM usage
/// @dev Replace this with your actual contract implementation
contract Example is ZamaEthereumConfig {
    // State variables
    euint32 private encryptedCounter;
    address public owner;

    // Events
    event ValueUpdated(address indexed user);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    /// @notice Updates the encrypted counter
    /// @param inputValue The encrypted input value
    /// @param inputProof The proof for the encrypted input
    function updateValue(externalEuint32 inputValue, bytes calldata inputProof) external {
        // Convert external encrypted input to internal encrypted value
        euint32 value = FHE.fromExternal(inputValue, inputProof);

        // Perform encrypted operation
        encryptedCounter = FHE.add(encryptedCounter, value);

        // Grant access permissions
        FHE.allowThis(encryptedCounter);
        FHE.allow(encryptedCounter, msg.sender);

        emit ValueUpdated(msg.sender);
    }

    /// @notice Grants access to the encrypted counter for the caller
    function grantAccess() external {
        FHE.allow(encryptedCounter, msg.sender);
    }

    /// @notice Returns the encrypted counter handle
    /// @return The encrypted counter value
    function getCounter() external view returns (euint32) {
        return encryptedCounter;
    }

    /// @notice Transfers ownership of the contract
    /// @param newOwner The address of the new owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}
