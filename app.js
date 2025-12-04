const CONTRACT_ADDRESS = '0x56CDd69fCe06dB3E2F9552A864BF0e2e258A56Cd';

const CONTRACT_ABI = [
    "function requestIncomeVerification(uint8 _incomeLevel, uint8 _employmentMonths, string calldata _documentHash) external",
    "function processVerificationRequest(uint256 _requestId, string calldata _employerHash, bool _isApproved) external",
    "function verifyIncomeThreshold(uint256 _verificationId, uint8 _requiredLevel) external view returns (bool)",
    "function compareIncomes(uint256 _verificationId1, uint256 _verificationId2) external view returns (bool)",
    "function getVerificationInfo(uint256 _verificationId) external view returns (bool isVerified, bool isActive, uint256 verificationTime, uint256 expiryTime, string memory employerHash, address verifiedUser)",
    "function getUserVerifications(address _user) external view returns (uint256[] memory)",
    "function getUserRequests(address _user) external view returns (uint256[] memory)",
    "function getRequestInfo(uint256 _requestId) external view returns (address requester, bool isPending, uint256 requestTime, string memory documentHash)",
    "function deactivateVerification(uint256 _verificationId) external",
    "function isVerificationValid(uint256 _verificationId) external view returns (bool)",
    "function getActiveVerificationCount() external view returns (uint256)",
    "function getPendingRequestCount() external view returns (uint256)",
    "function verificationAuthority() external view returns (address)",
    "function verificationCount() external view returns (uint256)",
    "function requestCounter() external view returns (uint256)",
    "event VerificationRequested(uint256 indexed requestId, address indexed requester, uint256 timestamp)",
    "event IncomeVerified(uint256 indexed verificationId, address indexed user, uint256 timestamp, bool meetsThreshold)",
    "event VerificationExpired(uint256 indexed verificationId, address indexed user)",
    "event ThresholdVerification(uint256 indexed verificationId, address indexed user, bool qualified)"
];

let provider;
let signer;
let contract;
let userAccount;

async function init() {
    setupTabSwitching();
    setupEventListeners();
    await checkConnection();
}

function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function setupEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('requestForm').addEventListener('submit', submitVerificationRequest);
    document.getElementById('loadRequests').addEventListener('click', loadUserRequests);
    document.getElementById('loadVerifications').addEventListener('click', loadUserVerifications);
    document.getElementById('processRequest').addEventListener('click', processVerificationRequest);
    document.getElementById('refreshAuthInfo').addEventListener('click', loadAuthorityInfo);
    document.getElementById('checkThreshold').addEventListener('click', checkIncomeThreshold);
    document.getElementById('compareIncomes').addEventListener('click', compareIncomes);
    document.getElementById('getInfo').addEventListener('click', getVerificationInfo);
    document.getElementById('deactivateBtn').addEventListener('click', deactivateVerification);

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
}

async function checkConnection() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    }
}

async function connectWallet() {
    try {
        if (!window.ethereum) {
            showMessage('Please install MetaMask to use this application', 'error');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        userAccount = accounts[0];

        updateWalletUI();
        await loadContractStats();
        await loadAuthorityInfo();

        showMessage('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showMessage('Failed to connect wallet: ' + error.message, 'error');
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        userAccount = accounts[0];
        updateWalletUI();
        loadContractStats();
    }
}

function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;

    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('connectWallet').classList.remove('hidden');
}

async function updateWalletUI() {
    if (userAccount) {
        const network = await provider.getNetwork();

        document.getElementById('walletAddress').textContent =
            userAccount.slice(0, 6) + '...' + userAccount.slice(-4);

        document.getElementById('networkBadge').textContent = network.name || `Chain ID: ${network.chainId}`;

        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').classList.add('hidden');
    }
}

async function loadContractStats() {
    if (!contract) return;

    try {
        const [verificationCount, activeCount, pendingCount, requestCount] = await Promise.all([
            contract.verificationCount(),
            contract.getActiveVerificationCount(),
            contract.getPendingRequestCount(),
            contract.requestCounter()
        ]);

        document.getElementById('totalVerifications').textContent = verificationCount.toString();
        document.getElementById('activeVerifications').textContent = activeCount.toString();
        document.getElementById('pendingRequests').textContent = pendingCount.toString();
        document.getElementById('totalRequests').textContent = requestCount.toString();
    } catch (error) {
        console.error('Error loading contract stats:', error);
    }
}

async function loadAuthorityInfo() {
    if (!contract) return;

    try {
        const [authority, pendingCount] = await Promise.all([
            contract.verificationAuthority(),
            contract.getPendingRequestCount()
        ]);

        document.getElementById('authorityAddress').textContent =
            authority.slice(0, 6) + '...' + authority.slice(-4);
        document.getElementById('pendingCount').textContent = pendingCount.toString();
    } catch (error) {
        console.error('Error loading authority info:', error);
    }
}

async function submitVerificationRequest(e) {
    e.preventDefault();

    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const incomeLevel = parseInt(document.getElementById('incomeLevel').value);
    const employmentMonths = parseInt(document.getElementById('employmentMonths').value);
    const documentHash = document.getElementById('documentHash').value;

    try {
        showMessage('Submitting verification request...', 'info');

        const tx = await contract.requestIncomeVerification(
            incomeLevel,
            employmentMonths,
            documentHash
        );

        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Verification request submitted successfully!', 'success');
        document.getElementById('requestForm').reset();
        await loadContractStats();
    } catch (error) {
        console.error('Error submitting request:', error);
        showMessage('Failed to submit request: ' + (error.reason || error.message), 'error');
    }
}

async function loadUserRequests() {
    if (!contract || !userAccount) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    try {
        const requestIds = await contract.getUserRequests(userAccount);
        const requestsList = document.getElementById('requestsList');

        if (requestIds.length === 0) {
            requestsList.innerHTML = '<p>No verification requests found.</p>';
            return;
        }

        let html = '';
        for (const id of requestIds) {
            const info = await contract.getRequestInfo(id);
            html += `
                <div class="list-item">
                    <strong>Request ID:</strong> ${id}<br>
                    <strong>Status:</strong> ${info.isPending ? 'Pending' : 'Processed'}<br>
                    <strong>Submitted:</strong> ${new Date(info.requestTime * 1000).toLocaleString()}<br>
                    <strong>Document Hash:</strong> ${info.documentHash}
                </div>
            `;
        }

        requestsList.innerHTML = html;
    } catch (error) {
        console.error('Error loading requests:', error);
        showMessage('Failed to load requests: ' + error.message, 'error');
    }
}

async function loadUserVerifications() {
    if (!contract || !userAccount) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    try {
        const verificationIds = await contract.getUserVerifications(userAccount);
        const verificationsList = document.getElementById('verificationsList');

        if (verificationIds.length === 0) {
            verificationsList.innerHTML = '<p>No verifications found.</p>';
            return;
        }

        let html = '';
        for (const id of verificationIds) {
            const info = await contract.getVerificationInfo(id);
            const isValid = await contract.isVerificationValid(id);

            html += `
                <div class="list-item">
                    <strong>Verification ID:</strong> ${id}<br>
                    <strong>Status:</strong> ${isValid ? 'Valid' : 'Expired'}<br>
                    <strong>Active:</strong> ${info.isActive ? 'Yes' : 'No'}<br>
                    <strong>Verified:</strong> ${new Date(info.verificationTime * 1000).toLocaleString()}<br>
                    <strong>Expires:</strong> ${new Date(info.expiryTime * 1000).toLocaleString()}<br>
                    <strong>Employer Hash:</strong> ${info.employerHash}
                </div>
            `;
        }

        verificationsList.innerHTML = html;
    } catch (error) {
        console.error('Error loading verifications:', error);
        showMessage('Failed to load verifications: ' + error.message, 'error');
    }
}

async function processVerificationRequest() {
    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const requestId = document.getElementById('authRequestId').value;
    const employerHash = document.getElementById('employerHash').value;
    const approval = document.querySelector('input[name="approval"]:checked').value === 'true';

    if (!requestId || !employerHash) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        showMessage('Processing verification request...', 'info');

        const tx = await contract.processVerificationRequest(
            requestId,
            employerHash,
            approval
        );

        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage(`Request ${approval ? 'approved' : 'rejected'} successfully!`, 'success');
        document.getElementById('authRequestId').value = '';
        document.getElementById('employerHash').value = '';
        await loadContractStats();
    } catch (error) {
        console.error('Error processing request:', error);
        showMessage('Failed to process request: ' + (error.reason || error.message), 'error');
    }
}

async function checkIncomeThreshold() {
    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const verificationId = document.getElementById('verifyId').value;
    const thresholdLevel = document.getElementById('thresholdLevel').value;

    if (!verificationId || !thresholdLevel) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const result = await contract.verifyIncomeThreshold(verificationId, thresholdLevel);

        document.getElementById('thresholdResult').innerHTML = `
            <strong>Threshold Check Result:</strong><br>
            Verification ID ${verificationId} ${result ? 'MEETS' : 'DOES NOT MEET'} the threshold of level ${thresholdLevel}
        `;
    } catch (error) {
        console.error('Error checking threshold:', error);
        showMessage('Failed to check threshold: ' + (error.reason || error.message), 'error');
    }
}

async function compareIncomes() {
    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const id1 = document.getElementById('compareId1').value;
    const id2 = document.getElementById('compareId2').value;

    if (!id1 || !id2) {
        showMessage('Please fill in both verification IDs', 'error');
        return;
    }

    try {
        const result = await contract.compareIncomes(id1, id2);

        document.getElementById('compareResult').innerHTML = `
            <strong>Income Comparison Result:</strong><br>
            Verification ID ${id1} has ${result ? 'HIGHER OR EQUAL' : 'LOWER'} income level than ID ${id2}
        `;
    } catch (error) {
        console.error('Error comparing incomes:', error);
        showMessage('Failed to compare incomes: ' + (error.reason || error.message), 'error');
    }
}

async function getVerificationInfo() {
    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const verificationId = document.getElementById('infoId').value;

    if (!verificationId) {
        showMessage('Please enter a verification ID', 'error');
        return;
    }

    try {
        const info = await contract.getVerificationInfo(verificationId);
        const isValid = await contract.isVerificationValid(verificationId);

        document.getElementById('infoResult').innerHTML = `
            <strong>Verification Information:</strong><br>
            <strong>ID:</strong> ${verificationId}<br>
            <strong>Verified:</strong> ${info.isVerified ? 'Yes' : 'No'}<br>
            <strong>Active:</strong> ${info.isActive ? 'Yes' : 'No'}<br>
            <strong>Valid:</strong> ${isValid ? 'Yes' : 'No'}<br>
            <strong>Verification Time:</strong> ${new Date(info.verificationTime * 1000).toLocaleString()}<br>
            <strong>Expiry Time:</strong> ${new Date(info.expiryTime * 1000).toLocaleString()}<br>
            <strong>Employer Hash:</strong> ${info.employerHash}<br>
            <strong>User:</strong> ${info.verifiedUser}
        `;
    } catch (error) {
        console.error('Error getting verification info:', error);
        showMessage('Failed to get information: ' + (error.reason || error.message), 'error');
    }
}

async function deactivateVerification() {
    if (!contract) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }

    const verificationId = document.getElementById('deactivateId').value;

    if (!verificationId) {
        showMessage('Please enter a verification ID', 'error');
        return;
    }

    if (!confirm('Are you sure you want to deactivate this verification?')) {
        return;
    }

    try {
        showMessage('Deactivating verification...', 'info');

        const tx = await contract.deactivateVerification(verificationId);

        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Verification deactivated successfully!', 'success');
        document.getElementById('deactivateId').value = '';
        await loadContractStats();
    } catch (error) {
        console.error('Error deactivating verification:', error);
        showMessage('Failed to deactivate: ' + (error.reason || error.message), 'error');
    }
}

function showMessage(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.classList.add('show');

    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

window.addEventListener('load', init);
