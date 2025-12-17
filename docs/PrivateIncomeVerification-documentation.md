# Private Income Verification Tests

This test suite demonstrates the Private Income Verification smart contract,
which showcases several key FHEVM concepts:

- **Encryption**: How to encrypt sensitive income data using FHE
- **Access Control**: Using FHE.allow() and FHE.allowThis() for permission management
- **User Decryption**: Allowing users to decrypt their own verification data
- **Public Decryption**: Authority-based decryption for verification processing
- **Confidential Comparisons**: Comparing encrypted values without revealing actual data

**Chapters**: access-control, user-decryption, public-decryption

## Overview

The contract enables privacy-preserving income verification where:
- Users can prove income meets thresholds without revealing exact amounts
- Employers and authorities can verify without accessing sensitive data
- All income values remain encrypted on-chain

