# FHEVM Example: Private Income Verification

> **Zama Bounty Track December 2025 Submission**

A comprehensive FHEVM example demonstrating privacy-preserving income verification using Fully Homomorphic Encryption (FHE) on the blockchain. This project showcases key FHEVM concepts including encryption, access control, user decryption, and confidential computations.

Video :https://streamable.com/orvycd  demo2.mp4 demo1.mp4

Live :https://private-income-verification-fhevm-e.vercel.app/

## 📋 Quick Start

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy to Sepolia

```bash
npm run deploy
```

### Generate Documentation

```bash
npm run generate-docs
```

## 🏆 Bounty Track Features

This example repository fulfills all requirements of the Zama Bounty Track December 2025:

✅ **Hardhat-Based**: Complete Hardhat setup with TypeScript support
✅ **Automated Scaffolding**: CLI tool (`create-fhevm-example.ts`) for generating new examples
✅ **Comprehensive Tests**: Full test suite with TSDoc annotations
✅ **Documentation Generation**: Automatic GitBook-compatible docs from code annotations
✅ **Access Control**: Demonstrates FHE.allow() and FHE.allowThis() patterns
✅ **User Decryption**: Shows how users decrypt their own encrypted data
✅ **Public Decryption**: Authority-based decryption workflows
✅ **Anti-patterns**: Documents common pitfalls and mistakes to avoid
✅ **Edge Cases**: Comprehensive testing of boundary conditions

## 🔐 Core Concepts

### Fully Homomorphic Encryption (FHE)

This platform leverages **Fully Homomorphic Encryption** to enable computations on encrypted data without ever exposing the underlying sensitive information. Income verification can be performed while maintaining complete privacy of actual income amounts.

### Confidential Income Verification

Traditional income verification processes expose sensitive financial data to multiple parties. Our platform solves this by:

- **Encrypting income data** at the point of submission
- **Performing verification** on encrypted values
- **Comparing thresholds** without revealing actual amounts
- **Maintaining privacy** throughout the entire verification lifecycle

### Privacy-Preserving Proofs

Users can prove their income meets certain thresholds without disclosing exact amounts:

- Prove income exceeds a minimum requirement
- Compare income levels between verifications
- Verify employment duration confidentially
- All while keeping actual figures encrypted on-chain

## 🎯 Key Features

### For Users
- **Submit Verification Requests**: Encrypt and submit income information with employment documentation
- **Privacy Protection**: Income levels are encrypted using FHE (values 0-255 representing income classifications)
- **View Status**: Track verification requests and approved verifications
- **Threshold Checks**: Verify if income meets requirements without revealing exact amounts
- **Deactivation Control**: Users can deactivate their own verifications

### For Authorities
- **Process Requests**: Review and approve/reject verification submissions
- **Employer Hash Recording**: Link verifications to employer information while maintaining privacy
- **Access Control**: Only authorized addresses can process verifications
- **Audit Trail**: All actions are recorded on-chain with timestamps

### Privacy Features
- **Encrypted Storage**: All income data stored in encrypted format on blockchain
- **Confidential Comparisons**: Compare income levels without decryption
- **Access Control**: FHE-based permission system for data access
- **No Plaintext Exposure**: Income amounts never stored or transmitted in plaintext

## 📊 How It Works

### 1. Request Submission
Users submit their income information which gets encrypted using FHE:
```
- Income Level (0-255): Encrypted classification of income range
- Employment Duration: Months of continuous employment (encrypted)
- Document Hash: Hash of supporting documentation
```

### 2. Authority Review
Verification authorities can:
- Review pending requests
- Approve or reject based on supporting documentation
- Add employer information hash for verification linking

### 3. Verification Use
Approved verifications enable:
- Threshold verification (does income meet minimum requirements?)
- Income level comparison between different verifications
- Time-bounded validity (365 days expiration)
- Access-controlled information retrieval

### 4. Privacy Guarantees
- Income values are encrypted using FHE
- Computations performed on encrypted data
- Results reveal only comparison outcomes, not actual values
- On-chain storage maintains encryption

## 🏗️ Technical Architecture

### Project Structure

```
├── contracts/                    # Solidity smart contracts
│   └── PrivateIncomeVerification.sol
├── test/                        # Test files with TSDoc annotations
│   └── PrivateIncomeVerification.test.ts
├── scripts/                     # Automation and deployment scripts
│   ├── deploy.ts               # Contract deployment script
│   ├── generate-docs.ts        # Documentation generator
│   └── create-fhevm-example.ts # Example scaffolding tool
├── docs/                        # Generated GitBook documentation
├── hardhat.config.ts           # Hardhat configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

### Smart Contract
Built with Solidity 0.8.24 and FHEVM libraries:
- **Solidity Version**: 0.8.24
- **FHE Library**: @fhevm/solidity v0.5.0
- **Network**: Ethereum Sepolia Testnet (deployable to any EVM chain)
- **Test Framework**: Hardhat with TypeScript

### Core Data Structures
```solidity
struct IncomeVerification {
    euint8 encryptedIncomeLevel;      // FHE-encrypted income classification
    euint8 encryptedEmploymentMonths; // FHE-encrypted employment duration
    bool isVerified;                  // Verification status
    bool isActive;                    // Active/deactivated state
    uint256 verificationTime;         // Timestamp of verification
    uint256 expiryTime;              // Expiration timestamp (365 days)
    string employerHash;             // Hash of employer information
    address verifiedUser;            // User address
}
```

### Testing Suite
- **Framework**: Hardhat with TypeScript and Chai
- **Coverage**: Comprehensive test cases with edge cases
- **Documentation**: TSDoc annotations for automatic doc generation
- **Patterns**: Demonstrates best practices and anti-patterns

## 🎬 Demo Video

📹 A demonstration video is included showing:
- Project setup and installation
- Running tests with comprehensive output
- Deploying the contract
- Generating documentation
- Key FHEVM concepts in action

**Video file**: `demo1.mp4 demo2.mp4`

## 🚀 Automation Tools

### Scaffolding New Examples

Create new FHEVM examples using the included scaffolding tool:

```bash
npm run create-example
```

This interactive CLI will:
1. Prompt for example configuration
2. Generate complete Hardhat project structure
3. Copy template files and scripts
4. Set up documentation generation
5. Create proper .gitignore and configs

### Documentation Generation

Automatically generate GitBook-compatible documentation from test annotations:

```bash
npm run generate-docs
```

The generator extracts:
- Chapter tags for categorization
- Test descriptions and examples
- Anti-patterns and best practices
- Code snippets and usage examples

## 🛡️ Security Considerations

### Encryption Security
- FHE ensures computations on encrypted data
- Private keys never leave user's wallet
- No plaintext income data on-chain

### Access Control
- Authority-based verification approval
- User-controlled deactivation
- Permission-based information access
- Time-bounded verification validity

### Smart Contract Security
- Audited encryption library usage
- Access modifier protections
- Input validation on all functions
- Event logging for transparency

## 📋 Use Cases

### Financial Services
- Loan qualification without income disclosure
- Credit assessments with privacy
- Tenant screening with confidentiality

### Employment
- Job application income verification
- Salary negotiation proof points
- Background checks with privacy

### Government Services
- Benefits eligibility verification
- Tax bracket confirmation
- Subsidy qualification

### General
- Any scenario requiring income proof without exposure
- Privacy-preserving financial assessments
- Confidential threshold validations

## 🔬 FHEVM Concepts Demonstrated

### 1. Encryption
```solidity
euint8 encryptedIncomeLevel = FHE.asEuint8(_incomeLevel);
```
- Converting plaintext values to FHE-encrypted types
- Using euint8, euint32, euint64, and ebool
- Maintaining type safety with encrypted values

### 2. Access Control
```solidity
FHE.allowThis(encryptedIncomeLevel);
FHE.allow(encryptedIncomeLevel, msg.sender);
```
- **FHE.allowThis()**: Grants contract permission to use encrypted values
- **FHE.allow()**: Grants specific addresses access to encrypted data
- Demonstrates proper permission management patterns

### 3. User Decryption
- Users can decrypt their own verification data
- Access control ensures only authorized parties can decrypt
- Demonstrates privacy-preserving data access patterns

### 4. Public Decryption
- Authority-based decryption for verification processing
- Threshold checks without revealing exact values
- Demonstrates secure multi-party computation patterns

### 5. Confidential Comparisons
- Comparing encrypted income levels without decryption
- Threshold verification while maintaining privacy
- Demonstrates FHE computation capabilities

### 6. Handle Management
- Proper handling of encrypted value handles
- Understanding handle lifecycle and symbolic execution
- Demonstrates best practices for FHE handle usage

## 📖 Learning Resources

### Test Documentation
The test suite (`test/PrivateIncomeVerification.test.ts`) includes extensive TSDoc annotations covering:
- **Setup**: How to deploy and initialize FHEVM contracts
- **Encryption**: Converting plaintext to encrypted values
- **Access Control**: Managing permissions for encrypted data
- **Best Practices**: Proper patterns for FHEVM development
- **Anti-patterns**: Common mistakes and how to avoid them
- **Edge Cases**: Boundary conditions and error handling

### Generated Documentation
Run `npm run generate-docs` to generate comprehensive GitBook documentation including:
- Complete API reference
- Concept explanations with examples
- Step-by-step tutorials
- Common pitfalls and solutions

## 🔬 Technical Innovations

### Practical FHE Application
This example demonstrates practical application of Fully Homomorphic Encryption in a real-world scenario:
- **Encrypted Computations**: Income comparisons without decryption
- **Privacy-Preserving Proofs**: Threshold verification while maintaining confidentiality
- **On-chain Privacy**: Encrypted data storage with computation capabilities
- **Secure Multi-Party Computation**: Multiple parties can interact without revealing sensitive data

### Blockchain + FHE Benefits
- **Immutability**: Verification records cannot be altered
- **Transparency**: All operations logged and auditable (except encrypted values)
- **Decentralization**: No central authority controls the data
- **Privacy**: Sensitive information remains encrypted on-chain
- **Accessibility**: Global access without intermediaries

## 🌟 Future Enhancements

- Multi-chain deployment for broader accessibility
- Advanced FHE operations (ranges, averages)
- Integration with identity verification systems
- Mobile application development
- Additional privacy-preserving features
- Oracle integration for real-time data validation

## 📞 Support & Community

For questions, issues, or contributions:
- Open an issue on GitHub
- Submit pull requests for improvements
- Join discussions in the repository
- Reach out through the Zama community channels

## 🎯 Bounty Submission Details

### Zama Bounty Track December 2025

This repository is a submission for the **"Build FHEVM Example Hub"** bounty challenge.

**Bounty Requirements Fulfilled**:
- ✅ Hardhat-based project structure
- ✅ Comprehensive testing with TSDoc annotations
- ✅ Automated scaffolding tool (`create-fhevm-example.ts`)
- ✅ Documentation generator (`generate-docs.ts`)
- ✅ GitBook-compatible documentation
- ✅ Multiple FHEVM concepts demonstrated (encryption, access control, decryption)
- ✅ Anti-patterns and best practices documented
- ✅ Edge cases and error handling covered
- ✅ Demo video included

### What Makes This Example Special

1. **Real-World Use Case**: Solves actual privacy problems in income verification
2. **Comprehensive Documentation**: Extensive TSDoc annotations with explanations
3. **Advanced Patterns**: Demonstrates complex access control and multi-party computation
4. **Production-Ready**: Includes proper error handling, validation, and security checks
5. **Educational Value**: Clear anti-patterns and best practices for learning
6. **Automation**: Complete tooling for creating similar examples

## 🙏 Acknowledgments

Built for the **Zama Bounty Track December 2025** with:
- **Zama's FHEVM**: For Fully Homomorphic Encryption capabilities
- **Hardhat**: For robust smart contract development framework
- **TypeScript**: For type-safe testing and scripting
- **Ethers.js**: For blockchain interaction
- Community feedback and support

## 📚 Additional Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Bounty Track Details](https://www.zama.ai/bounty-program)

---

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please ensure:
- All tests pass (`npm test`)
- Code follows existing patterns
- TSDoc comments are comprehensive
- Documentation generates correctly (`npm run generate-docs`)

---

**Note**: This is an example implementation for educational purposes. For production use, additional security audits and testing are recommended.

**Privacy First. Verification Always. Trust Enabled.** 🔐
