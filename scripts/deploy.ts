/**
 * @title Deploy Private Income Verification Contract
 * @description
 * Deployment script for the PrivateIncomeVerification contract.
 * This script deploys the contract and outputs the deployed address.
 */

import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PrivateIncomeVerification contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const PrivateIncomeVerificationFactory = await ethers.getContractFactory(
    "PrivateIncomeVerification"
  );
  const contract = await PrivateIncomeVerificationFactory.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("PrivateIncomeVerification deployed to:", address);
  console.log("Verification authority:", deployer.address);

  // Verify deployment
  const authority = await contract.verificationAuthority();
  console.log("Contract verification authority:", authority);

  console.log("\nDeployment complete!");
  console.log("Save this address for verification:");
  console.log(address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
