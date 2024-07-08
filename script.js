const contractAddress = '0x4F34116626B41cd5309a9c9Af8fb89Cff84fcBbE';

let provider;
let signer;
let contract;
let totalCoin;

(async () => {
  console.log('hello');
  const response = await fetch('./abi.json');
  const abi = await response.json();
  console.log(abi);
})();

document.addEventListener('DOMContentLoaded', async () => {
  document
    .getElementById('connect-button')
    .addEventListener('click', async () => {
      await connectWallet();
    });

  document
    .getElementById('check-balance')
    .addEventListener('click', async () => {
      const address = document.getElementById('balance-address').value;
      const balance = await contract.balanceOf(address);
      console.log(balance);
      document.getElementById(
        'balance-result'
      ).innerText = `Balance: ${ethers.utils.formatUnits(balance, 18)}`;
    });

  document
    .getElementById('transfer-tokens')
    .addEventListener('click', async () => {
      try {
        const recipient = document.getElementById('recipient-address').value;
        const amount = document.getElementById('transfer-amount').value;
        const tx = await contract.transfer(
          recipient,
          ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();
        document.getElementById('transfer-result').innerText =
          'Transfer successful!';
      } catch (e) {
        console.log(e.message);
      }
    });
});

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();

    // Fetch the ABI from the JSON file
    const response = await fetch('./abi.json');
    const abi = await response.json();

    contract = new ethers.Contract(contractAddress, abi, signer);

    if (contract) {
      document.getElementById('connect-button').innerText = 'Connected';
    }

    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      totalCoin = totalSupply;

      console.log('Details: ', name, symbol, totalSupply);
      document.getElementById('contract-name').innerText = `Name: ${name}`;
      document.getElementById(
        'contract-symbol'
      ).innerText = `Symbol: ${symbol}`;
      document.getElementById(
        'total-supply'
      ).innerText = `Total Supply: ${ethers.utils.formatUnits(
        totalSupply,
        18
      )}`;
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('MetaMask is not installed. Please install it to use this app.');
  }
}
