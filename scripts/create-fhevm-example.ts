/**
 * @title FHEVM Example Scaffolding Tool
 * @description
 * CLI tool to generate new FHEVM example repositories based on this template.
 * This automates the creation of consistent, well-documented FHEVM examples.
 *
 * Usage:
 *   npm run create-example
 *   ts-node scripts/create-fhevm-example.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface ExampleConfig {
  name: string;
  displayName: string;
  description: string;
  chapter: string;
  contractName: string;
  outputDir: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Generate package.json for new example
 */
function generatePackageJson(config: ExampleConfig): string {
  return JSON.stringify(
    {
      name: `fhevm-example-${config.name}`,
      version: "1.0.0",
      description: config.description,
      main: "index.js",
      scripts: {
        test: "hardhat test",
        compile: "hardhat compile",
        deploy: "hardhat run scripts/deploy.ts",
        "generate-docs": "ts-node scripts/generate-docs.ts",
      },
      keywords: [
        "fhevm",
        "fhe",
        "homomorphic-encryption",
        "privacy",
        config.chapter,
        "zama",
        "hardhat",
        "ethereum",
      ],
      author: "FHEVM Examples",
      license: "MIT",
      devDependencies: {
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "@types/node": "^20.10.0",
        hardhat: "^2.19.0",
        "ts-node": "^10.9.1",
        typescript: "^5.3.0",
        "@typechain/ethers-v6": "^0.5.0",
        "@typechain/hardhat": "^9.0.0",
      },
      dependencies: {
        "@fhevm/solidity": "^0.5.0",
        ethers: "^6.9.0",
        dotenv: "^16.3.0",
      },
    },
    null,
    2
  );
}

/**
 * Generate README.md for new example
 */
function generateReadme(config: ExampleConfig): string {
  return `# ${config.displayName}

${config.description}

## Overview

This example demonstrates FHEVM concepts in the **${config.chapter}** chapter, including:

- Encrypted data handling with FHE
- Access control patterns
- Privacy-preserving computations
- Best practices for FHEVM development

## Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
npm test
\`\`\`

### Deploy

\`\`\`bash
npm run deploy
\`\`\`

### Generate Documentation

\`\`\`bash
npm run generate-docs
\`\`\`

## Project Structure

\`\`\`
├── contracts/          # Solidity smart contracts
│   └── ${config.contractName}.sol
├── test/              # Test files with TSDoc annotations
│   └── ${config.contractName}.test.ts
├── scripts/           # Deployment and utility scripts
│   ├── deploy.ts
│   └── generate-docs.ts
├── docs/              # Generated documentation
├── hardhat.config.ts  # Hardhat configuration
└── README.md          # This file
\`\`\`

## Key Concepts

### FHEVM Features Demonstrated

- **Encryption**: Converting plaintext to FHE-encrypted values
- **Access Control**: Managing permissions for encrypted data
- **Computation**: Performing operations on encrypted data
- **Decryption**: Retrieving results with proper authorization

### Smart Contract

The \`${config.contractName}\` contract showcases:

- FHE data types (euint8, euint32, euint64, ebool)
- FHE.allow() and FHE.allowThis() for access control
- Privacy-preserving business logic
- Event emission for transparency

## Testing

Tests are written in TypeScript with comprehensive TSDoc annotations:

\`\`\`bash
npm test
\`\`\`

Test coverage includes:
- ✅ Deployment and initialization
- ✅ Access control enforcement
- ✅ Encryption and decryption flows
- ✅ Edge cases and error handling
- ✅ Common pitfalls and anti-patterns

## Documentation

Generate GitBook-compatible documentation:

\`\`\`bash
npm run generate-docs
\`\`\`

Documentation is automatically extracted from TSDoc comments in test files.

## Configuration

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`env
SEPOLIA_RPC_URL=your-rpc-url
PRIVATE_KEY=your-private-key
\`\`\`

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please ensure:
- All tests pass
- Code follows existing patterns
- TSDoc comments are comprehensive
- Documentation generates correctly

---

**Built with Zama FHEVM** 🔐
`;
}

/**
 * Generate hardhat.config.ts for new example
 */
function generateHardhatConfig(): string {
  return `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
`;
}

/**
 * Generate tsconfig.json for new example
 */
function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: "node",
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ["scripts/**/*", "test/**/*", "hardhat.config.ts"],
      exclude: ["node_modules", "dist", "cache", "artifacts"],
      files: ["./hardhat.config.ts"],
    },
    null,
    2
  );
}

/**
 * Generate .gitignore for new example
 */
function generateGitignore(): string {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
artifacts/
cache/
typechain-types/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Hardhat
coverage/
coverage.json
.openzeppelin/
deployments/

# Logs
*.log

# Lock files
package-lock.json
yarn.lock
`;
}

/**
 * Generate .env.example for new example
 */
function generateEnvExample(): string {
  return `# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key-here

# Contract Addresses (after deployment)
CONTRACT_ADDRESS=

# Optional: Etherscan API Key for verification
ETHERSCAN_API_KEY=
`;
}

/**
 * Create directory structure
 */
function createDirectoryStructure(config: ExampleConfig): void {
  const dirs = [
    config.outputDir,
    path.join(config.outputDir, "contracts"),
    path.join(config.outputDir, "test"),
    path.join(config.outputDir, "scripts"),
    path.join(config.outputDir, "docs"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created: ${dir}`);
    }
  });
}

/**
 * Write configuration files
 */
function writeConfigFiles(config: ExampleConfig): void {
  const files = [
    {
      path: path.join(config.outputDir, "package.json"),
      content: generatePackageJson(config),
    },
    {
      path: path.join(config.outputDir, "README.md"),
      content: generateReadme(config),
    },
    {
      path: path.join(config.outputDir, "hardhat.config.ts"),
      content: generateHardhatConfig(),
    },
    {
      path: path.join(config.outputDir, "tsconfig.json"),
      content: generateTsConfig(),
    },
    {
      path: path.join(config.outputDir, ".gitignore"),
      content: generateGitignore(),
    },
    {
      path: path.join(config.outputDir, ".env.example"),
      content: generateEnvExample(),
    },
  ];

  files.forEach((file) => {
    fs.writeFileSync(file.path, file.content);
    console.log(`  Generated: ${path.basename(file.path)}`);
  });
}

/**
 * Copy template files (deploy script and doc generator)
 */
function copyTemplateFiles(config: ExampleConfig): void {
  const templateDir = __dirname;
  const targetScriptsDir = path.join(config.outputDir, "scripts");

  // Copy deploy.ts and generate-docs.ts from current scripts directory
  const filesToCopy = ["deploy.ts", "generate-docs.ts"];

  filesToCopy.forEach((file) => {
    const sourcePath = path.join(templateDir, file);
    const targetPath = path.join(targetScriptsDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  Copied: scripts/${file}`);
    }
  });
}

/**
 * Main scaffolding function
 */
async function scaffold() {
  console.log("🔧 FHEVM Example Scaffolding Tool\n");
  console.log("This tool will create a new FHEVM example repository.\n");

  try {
    // Gather configuration
    const name = await question("Example name (kebab-case, e.g., 'access-control'): ");
    const displayName = await question("Display name (e.g., 'Access Control Example'): ");
    const description = await question("Brief description: ");
    const chapter = await question("Chapter/category (e.g., 'access-control', 'encryption'): ");
    const contractName = await question("Contract name (e.g., 'AccessControl'): ");
    const outputDir = await question("Output directory (relative or absolute): ");

    const config: ExampleConfig = {
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim(),
      chapter: chapter.trim(),
      contractName: contractName.trim(),
      outputDir: path.resolve(outputDir.trim()),
    };

    console.log("\n📋 Configuration:");
    console.log(`  Name: ${config.name}`);
    console.log(`  Display Name: ${config.displayName}`);
    console.log(`  Description: ${config.description}`);
    console.log(`  Chapter: ${config.chapter}`);
    console.log(`  Contract Name: ${config.contractName}`);
    console.log(`  Output Directory: ${config.outputDir}\n`);

    const confirm = await question("Proceed with scaffolding? (y/n): ");

    if (confirm.toLowerCase() !== "y") {
      console.log("Cancelled.");
      rl.close();
      return;
    }

    console.log("\n🚀 Scaffolding new FHEVM example...\n");

    // Create directory structure
    console.log("Creating directories...");
    createDirectoryStructure(config);

    // Write configuration files
    console.log("\nGenerating configuration files...");
    writeConfigFiles(config);

    // Copy template files
    console.log("\nCopying template files...");
    copyTemplateFiles(config);

    console.log("\n✅ Scaffolding complete!\n");
    console.log("Next steps:");
    console.log(`  1. cd ${config.outputDir}`);
    console.log("  2. npm install");
    console.log(`  3. Create your contract: contracts/${config.contractName}.sol`);
    console.log(`  4. Create tests: test/${config.contractName}.test.ts`);
    console.log("  5. npm test");
    console.log("  6. npm run generate-docs\n");

    console.log("📚 Don't forget to:");
    console.log("  - Add TSDoc annotations to your tests");
    console.log("  - Include @chapter tags for documentation");
    console.log("  - Document anti-patterns and best practices");
    console.log("  - Test edge cases and error conditions\n");
  } catch (error) {
    console.error("Error during scaffolding:", error);
  } finally {
    rl.close();
  }
}

// Run scaffolding
scaffold();
