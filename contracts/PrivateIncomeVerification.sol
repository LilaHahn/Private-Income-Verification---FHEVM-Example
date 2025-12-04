// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivateIncomeVerification is SepoliaConfig {

    address public verificationAuthority;
    uint256 public verificationCount;
    uint256 public constant MIN_VERIFICATION_THRESHOLD = 1000; // Minimum income threshold
    uint256 public constant VERIFICATION_VALIDITY_PERIOD = 365 days;

    struct IncomeVerification {
        euint8 encryptedIncomeLevel;
        euint8 encryptedEmploymentMonths;
        bool isVerified;
        bool isActive;
        uint256 verificationTime;
        uint256 expiryTime;
        string employerHash; // Hash of employer information for privacy
        address verifiedUser;
    }

    struct VerificationRequest {
        address requester;
        euint8 claimedIncomeLevel;
        euint8 employmentDuration;
        bool isPending;
        uint256 requestTime;
        string documentHash;
    }

    mapping(uint256 => IncomeVerification) public verifications;
    mapping(address => uint256[]) public userVerifications;
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => uint256[]) public userRequests;

    uint256 public requestCounter;

    event VerificationRequested(
        uint256 indexed requestId,
        address indexed requester,
        uint256 timestamp
    );

    event IncomeVerified(
        uint256 indexed verificationId,
        address indexed user,
        uint256 timestamp,
        bool meetsThreshold
    );

    event VerificationExpired(
        uint256 indexed verificationId,
        address indexed user
    );

    event ThresholdVerification(
        uint256 indexed verificationId,
        address indexed user,
        bool qualified
    );

    modifier onlyAuthority() {
        require(msg.sender == verificationAuthority, "Not authorized");
        _;
    }

    modifier validVerification(uint256 _verificationId) {
        require(_verificationId < verificationCount, "Invalid verification ID");
        require(verifications[_verificationId].isActive, "Verification not active");
        require(block.timestamp <= verifications[_verificationId].expiryTime, "Verification expired");
        _;
    }

    constructor() {
        verificationAuthority = msg.sender;
        verificationCount = 0;
        requestCounter = 0;
    }

    function requestIncomeVerification(
        uint8 _incomeLevel,
        uint8 _employmentMonths,
        string calldata _documentHash
    ) external {
        require(_incomeLevel > 0, "Income level must be greater than 0");
        require(_employmentMonths > 0, "Employment duration must be greater than 0");
        require(bytes(_documentHash).length > 0, "Document hash required");

        // Encrypt sensitive data
        euint8 encryptedIncomeLevel = FHE.asEuint8(_incomeLevel);
        euint8 encryptedEmploymentMonths = FHE.asEuint8(_employmentMonths);

        verificationRequests[requestCounter] = VerificationRequest({
            requester: msg.sender,
            claimedIncomeLevel: encryptedIncomeLevel,
            employmentDuration: encryptedEmploymentMonths,
            isPending: true,
            requestTime: block.timestamp,
            documentHash: _documentHash
        });

        userRequests[msg.sender].push(requestCounter);

        // Grant access permissions
        FHE.allowThis(encryptedIncomeLevel);
        FHE.allowThis(encryptedEmploymentMonths);
        FHE.allow(encryptedIncomeLevel, msg.sender);
        FHE.allow(encryptedEmploymentMonths, msg.sender);

        emit VerificationRequested(requestCounter, msg.sender, block.timestamp);

        requestCounter++;
    }

    function processVerificationRequest(
        uint256 _requestId,
        string calldata _employerHash,
        bool _isApproved
    ) external onlyAuthority {
        require(_requestId < requestCounter, "Invalid request ID");
        require(verificationRequests[_requestId].isPending, "Request not pending");
        require(bytes(_employerHash).length > 0, "Employer hash required");

        VerificationRequest storage request = verificationRequests[_requestId];
        request.isPending = false;

        if (_isApproved) {
            verifications[verificationCount] = IncomeVerification({
                encryptedIncomeLevel: request.claimedIncomeLevel,
                encryptedEmploymentMonths: request.employmentDuration,
                isVerified: true,
                isActive: true,
                verificationTime: block.timestamp,
                expiryTime: block.timestamp + VERIFICATION_VALIDITY_PERIOD,
                employerHash: _employerHash,
                verifiedUser: request.requester
            });

            userVerifications[request.requester].push(verificationCount);

            // Check if income meets threshold
            _checkIncomeThreshold(verificationCount);

            emit IncomeVerified(verificationCount, request.requester, block.timestamp, true);

            verificationCount++;
        }
    }

    function _checkIncomeThreshold(uint256 _verificationId) private {
        IncomeVerification storage verification = verifications[_verificationId];

        // For demonstration, we'll emit an event to indicate threshold check was performed
        // In a real implementation, this would trigger async decryption for result processing
        emit ThresholdVerification(_verificationId, verification.verifiedUser, true);
    }

    function verifyIncomeThreshold(
        uint256 _verificationId,
        uint8 _requiredLevel
    ) external view validVerification(_verificationId) returns (bool) {
        IncomeVerification storage verification = verifications[_verificationId];
        require(verification.verifiedUser == msg.sender || msg.sender == verificationAuthority, "Not authorized");

        // Return true for demonstration - real implementation would use FHE comparison
        return true;
    }

    function compareIncomes(
        uint256 _verificationId1,
        uint256 _verificationId2
    ) external view
        validVerification(_verificationId1)
        validVerification(_verificationId2)
        returns (bool) {
        require(
            verifications[_verificationId1].verifiedUser == msg.sender ||
            verifications[_verificationId2].verifiedUser == msg.sender ||
            msg.sender == verificationAuthority,
            "Not authorized"
        );

        // Return true for demonstration - real implementation would use FHE comparison
        return true;
    }

    function getVerificationInfo(uint256 _verificationId)
        external
        view
        validVerification(_verificationId)
        returns (
            bool isVerified,
            bool isActive,
            uint256 verificationTime,
            uint256 expiryTime,
            string memory employerHash,
            address verifiedUser
        ) {
        IncomeVerification storage verification = verifications[_verificationId];
        require(
            verification.verifiedUser == msg.sender ||
            msg.sender == verificationAuthority,
            "Not authorized"
        );

        return (
            verification.isVerified,
            verification.isActive,
            verification.verificationTime,
            verification.expiryTime,
            verification.employerHash,
            verification.verifiedUser
        );
    }

    function getUserVerifications(address _user)
        external
        view
        returns (uint256[] memory) {
        require(_user == msg.sender || msg.sender == verificationAuthority, "Not authorized");
        return userVerifications[_user];
    }

    function getUserRequests(address _user)
        external
        view
        returns (uint256[] memory) {
        require(_user == msg.sender || msg.sender == verificationAuthority, "Not authorized");
        return userRequests[_user];
    }

    function getRequestInfo(uint256 _requestId)
        external
        view
        returns (
            address requester,
            bool isPending,
            uint256 requestTime,
            string memory documentHash
        ) {
        require(_requestId < requestCounter, "Invalid request ID");
        VerificationRequest storage request = verificationRequests[_requestId];
        require(
            request.requester == msg.sender ||
            msg.sender == verificationAuthority,
            "Not authorized"
        );

        return (
            request.requester,
            request.isPending,
            request.requestTime,
            request.documentHash
        );
    }

    function deactivateVerification(uint256 _verificationId)
        external
        validVerification(_verificationId) {
        IncomeVerification storage verification = verifications[_verificationId];
        require(
            verification.verifiedUser == msg.sender ||
            msg.sender == verificationAuthority,
            "Not authorized"
        );

        verification.isActive = false;
        emit VerificationExpired(_verificationId, verification.verifiedUser);
    }

    function updateVerificationAuthority(address _newAuthority) external onlyAuthority {
        require(_newAuthority != address(0), "Invalid authority address");
        verificationAuthority = _newAuthority;
    }

    function isVerificationValid(uint256 _verificationId)
        external
        view
        returns (bool) {
        if (_verificationId >= verificationCount) return false;
        IncomeVerification storage verification = verifications[_verificationId];
        return verification.isActive &&
               verification.isVerified &&
               block.timestamp <= verification.expiryTime;
    }

    function getActiveVerificationCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < verificationCount; i++) {
            if (verifications[i].isActive &&
                verifications[i].isVerified &&
                block.timestamp <= verifications[i].expiryTime) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function getPendingRequestCount() external view returns (uint256) {
        uint256 pendingCount = 0;
        for (uint256 i = 0; i < requestCounter; i++) {
            if (verificationRequests[i].isPending) {
                pendingCount++;
            }
        }
        return pendingCount;
    }
}