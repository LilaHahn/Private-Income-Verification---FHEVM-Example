import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Example contract...");

  // Get the contract factory
  const ExampleFactory = await ethers.getContractFactory("Example");

  // Deploy the contract
  const example = await ExampleFactory.deploy();

  // Wait for deployment
  await example.waitForDeployment();

  const address = await example.getAddress();
  console.log(`Example contract deployed to: ${address}`);

  // Get the owner
  const owner = await example.owner();
  console.log(`Contract owner: ${owner}`);

  console.log("\nDeployment complete!");
  console.log(`\nTo verify on Etherscan, run:`);
  console.log(`npx hardhat verify --network <network> ${address}`);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
