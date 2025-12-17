import { expect } from "chai";
import { ethers } from "hardhat";
import type { Example } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * @title Example Contract Tests
 * @notice This test suite demonstrates testing patterns for FHEVM contracts
 * @dev Replace with your actual test implementation
 *
 * @chapter basic
 * @chapter access-control
 */
describe("Example Contract", function () {
  let example: Example;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  /**
   * Deploy the contract before each test
   */
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const ExampleFactory = await ethers.getContractFactory("Example");
    example = await ExampleFactory.deploy();
    await example.waitForDeployment();
  });

  describe("Deployment", function () {
    /**
     * @example
     * Verifies that the contract owner is set correctly during deployment
     */
    it("Should set the correct owner", async function () {
      expect(await example.owner()).to.equal(owner.address);
    });
  });

  describe("Access Control", function () {
    /**
     * @example
     * Demonstrates proper access control for encrypted values.
     * Only authorized addresses should be able to access encrypted data.
     *
     * @bestpractice
     * Always verify that access control is working correctly.
     * Use FHE.allow() to grant access to specific addresses.
     */
    it("Should grant access to encrypted values", async function () {
      // In a real test, you would:
      // 1. Create an encrypted input
      // 2. Call updateValue with the encrypted input
      // 3. Verify that access is granted correctly

      // This is a placeholder - implement with actual FHEVM testing utilities
      expect(await example.owner()).to.equal(owner.address);
    });

    /**
     * @antipattern
     * Demonstrates what NOT to do: attempting to return encrypted values
     * from view functions without proper access control.
     *
     * Encrypted values cannot be directly returned and decrypted in view functions.
     * Users must be granted access and decrypt separately.
     */
    it("Should NOT return decrypted values directly", async function () {
      // This is a reminder that encrypted values cannot be directly decrypted
      // in tests without proper relayer setup
      const counter = await example.getCounter();
      expect(counter).to.exist;
    });
  });

  describe("Ownership", function () {
    /**
     * @example
     * Tests ownership transfer functionality
     */
    it("Should allow owner to transfer ownership", async function () {
      await example.transferOwnership(user1.address);
      expect(await example.owner()).to.equal(user1.address);
    });

    /**
     * @example
     * Tests that non-owners cannot transfer ownership
     */
    it("Should reject ownership transfer from non-owner", async function () {
      await expect(
        example.connect(user1).transferOwnership(user2.address)
      ).to.be.revertedWith("Not the owner");
    });

    /**
     * @example
     * Tests that ownership cannot be transferred to zero address
     */
    it("Should reject zero address as new owner", async function () {
      await expect(
        example.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });

  /**
   * @bestpractice
   * Always write comprehensive tests covering:
   * - Normal operation
   * - Edge cases
   * - Access control
   * - Error conditions
   * - Gas usage (optionally)
   */
});
