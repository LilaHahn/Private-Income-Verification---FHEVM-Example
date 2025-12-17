# FHEVM Example Template

This is the base template for creating FHEVM (Fully Homomorphic Encryption Virtual Machine) examples. It provides a complete Hardhat development environment configured for building privacy-preserving smart contracts using Zama's FHEVM technology.

## Features

- **Hardhat Development Environment**: Fully configured for FHEVM development
- **TypeScript Support**: Write tests and scripts in TypeScript
- **FHEVM Integration**: Pre-configured with @fhevm/solidity and hardhat plugins
- **Code Quality Tools**: ESLint, Prettier, and Solhint configurations
- **Gas Reporting**: Built-in gas usage reporting
- **Contract Verification**: Etherscan verification support

## Quick Start

### 1. Clone this template

```bash
git clone <repository-url>
cd <project-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 4. Write your contract

Create your FHEVM contract in `contracts/`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract YourContract is ZamaEthereumConfig {
    // Your encrypted state variables
    euint32 private encryptedValue;

    // Your functions
}
```

### 5. Write tests

Create tests in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("YourContract", function () {
  it("Should work correctly", async function () {
    // Your test logic
  });
});
```

### 6. Compile and test

```bash
npm run compile
npm test
```

## Available Scripts

- `npm test` - Run all tests
- `npm run compile` - Compile contracts
- `npm run deploy` - Deploy contracts
- `npm run lint` - Run all linters
- `npm run lint:sol` - Lint Solidity files
- `npm run lint:ts` - Lint TypeScript files
- `npm run prettier:check` - Check code formatting
- `npm run prettier:write` - Format code

## Project Structure

```
.
├── contracts/          # Solidity contracts
├── test/              # Test files
├── scripts/           # Deployment and utility scripts
├── hardhat.config.ts  # Hardhat configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Key FHEVM Concepts

### 1. Encrypted Types

FHEVM provides encrypted integer types:

- `euint8`, `euint16`, `euint32`, `euint64` - Encrypted unsigned integers
- `ebool` - Encrypted boolean
- `eaddress` - Encrypted address

### 2. FHE Operations

All operations on encrypted values use the FHE library:

```solidity
euint32 result = FHE.add(encryptedA, encryptedB);
ebool isEqual = FHE.eq(value1, value2);
```

### 3. Access Control

Grant access to encrypted values:

```solidity
FHE.allowThis(encryptedValue);        // Contract can use this value
FHE.allow(encryptedValue, address);   // Grant access to specific address
```

### 4. Input Handling

Accept encrypted inputs from users:

```solidity
function setValue(externalEuint32 input, bytes calldata inputProof) external {
    euint32 value = FHE.fromExternal(input, inputProof);
    // Use the encrypted value
}
```

### 5. Decryption

Request decryption (requires relayer):

```solidity
// User decryption - user can decrypt with their key
FHE.allow(encryptedValue, msg.sender);

// Public decryption - anyone can decrypt (use with caution)
uint32 decrypted = FHE.decrypt(encryptedValue);
```

## Networks

### Local Development

```bash
npx hardhat node
npm run deploy
```

### Sepolia Testnet

1. Get Sepolia ETH from a faucet
2. Configure your `.env` file
3. Deploy:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Best Practices

1. **Always use access control**: Grant permissions with `FHE.allow()` and `FHE.allowThis()`
2. **Validate inputs**: Check encrypted inputs with input proofs
3. **Avoid view functions**: Encrypted values cannot be returned from view functions
4. **Handle permissions carefully**: Only grant decryption permissions when necessary
5. **Test thoroughly**: Write comprehensive tests for all encrypted logic

## Common Pitfalls

### ❌ Don't: Return encrypted values from view functions
```solidity
// This will NOT work
function getValue() public view returns (euint32) {
    return encryptedValue;
}
```

### ✅ Do: Grant access and let users decrypt
```solidity
function grantAccess() public {
    FHE.allow(encryptedValue, msg.sender);
}
```

### ❌ Don't: Forget FHE.allowThis()
```solidity
// Missing permission for contract to use the value
_count = FHE.add(_count, encryptedInput);
```

### ✅ Do: Always grant contract permission
```solidity
_count = FHE.add(_count, encryptedInput);
FHE.allowThis(_count);  // Contract can use this value
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Example Projects](https://github.com/zama-ai/fhevm-hardhat-template)
- [Community Forum](https://community.zama.ai)

## License

MIT
