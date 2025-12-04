# One-Minute Demonstration Video Script
## Private Income Verification - FHEVM Example

### Scene Breakdown

**Scene 1: Introduction & Project Overview**
- Show terminal with project directory open
- Display project structure: contracts/, test/, scripts/
- Highlight: "Private Income Verification - FHEVM Example"
- Concept: Privacy-preserving income verification using Fully Homomorphic Encryption

**Scene 2: Project Setup**
- Run: `npm install`
- Show dependencies being installed
- Highlight key packages: @fhevm/solidity, hardhat, ethers.js
- Display successful installation message

**Scene 3: Test Execution**
- Run: `npm test`
- Show test suite running with multiple test cases
- Highlight passing tests:
  - Income verification submission
  - Access control with FHE permissions
  - User decryption workflows
  - Authority approval processes
  - Threshold verification
  - Edge cases handling
- Display test coverage summary

**Scene 4: Core Contract Demonstration**
- Open: contracts/PrivateIncomeVerification.sol
- Highlight key functions:
  - submitVerificationRequest() - Encrypted income submission
  - approveVerification() - Authority approval with FHE permissions
  - verifyThreshold() - Compare encrypted values
  - getUserVerification() - User decryption with access control

**Scene 5: FHEVM Concepts**
- Show encryption example:
  ```solidity
  euint8 encryptedIncomeLevel = FHE.asEuint8(_incomeLevel);
  ```
- Demonstrate access control:
  ```solidity
  FHE.allowThis(encryptedIncomeLevel);
  FHE.allow(encryptedIncomeLevel, msg.sender);
  ```
- Highlight confidential computations: threshold checks on encrypted data

**Scene 6: Documentation Generation**
- Run: `npm run generate-docs`
- Show auto-generated documentation being created
- Display generated docs/README.md
- Highlight: TSDoc annotations converted to comprehensive guides
- Show chapter-based organization: encryption, access-control, decryption

**Scene 7: Scaffolding Tool**
- Run: `npm run create-example`
- Show interactive CLI prompts
- Display: "Creating new FHEVM example..."
- Explain: Tool clones template and configures new project structure
- Show successful example generation

**Scene 8: Deployment Readiness**
- Show: hardhat.config.ts configuration
- Display: Network options (Sepolia, mainnet)
- Show: deployment script ready for use
- Highlight: `npm run deploy` command

**Scene 9: Security Features Recap**
- Display on screen:
  - ✅ Encrypted income data storage
  - ✅ FHE-based access control
  - ✅ No plaintext exposure
  - ✅ Multi-party computation
  - ✅ Time-bounded verification validity
  - ✅ Comprehensive test coverage

**Scene 10: Closing Statement**
- Show project success summary
- Display: "Build FHEVM Example Hub - Bounty Track December 2025"
- Final message: "Privacy First. Verification Always. Trust Enabled."
- Display: GitHub repository and documentation links

---

## Key Technical Points to Highlight

### Privacy Protection
- All income data encrypted using Fully Homomorphic Encryption
- Computations performed on encrypted values
- No plaintext ever stored or transmitted on-chain

### Access Control
- FHE-based permission system
- Users can decrypt their own data
- Authorities verify without seeing actual amounts
- Role-based verification workflow

### Automation Excellence
- Scaffolding tool for creating new examples
- Automated documentation generation from code
- Template-based project structure
- TypeScript for type safety

### Real-World Application
- Solves actual privacy problems in income verification
- Applicable to loans, employment, government services
- Maintains privacy while enabling verification
- Blockchain immutability with encryption

---

## Visual Elements to Include

1. **Terminal Output**: Show clear npm command execution
2. **Code Snippets**: Display key contract functions
3. **Test Results**: Comprehensive test passing display
4. **File Structure**: Show clean project organization
5. **Documentation**: Auto-generated docs quality
6. **Screen Text**: Key concepts and benefits
7. **Charts/Badges**: Verification status indicators
