// Create global userWalletAddress variable
window.userWalletAddress = null;
window.onload = async (event) => {

  // check if ethereum extension is installed
  if (window.ethereum) {
    // create web3 instance
    window.web3 = new Web3(window.ethereum);
  } else {
    // prompt user to install Metamask
    alert("Please install MetaMask or any Ethereum Extension Wallet");
  }

  // 5. check if user is already logged in and update the global userWalletAddress variable
  window.userWalletAddress = localStorage.getItem("userWalletAddress");
  showUserDashboard();
};



// Web3 login function
const loginWithEth = async () => {
  // check if there is global window.web3 instance
  if (window.web3) {

    document.querySelector(".login-btn").disabled = true;
    document.querySelector(".login-btn").innerHTML = '<span style="margin-right: 20px;" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Connecting...</span>';
    try {
      // get the user's ethereum account - prompts metamask to login
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          window.userWalletAddress = accounts[0];
          window.localStorage.setItem("userWalletAddress", accounts[0]);
          window.location.href = './dashboard.html';
        })
        .catch(() => {
          // if the user cancels the login prompt
          document.querySelector(".login-btn").disabled = false;
          document.querySelector(".login-btn").innerHTML = 'Connect Wallet';
          throw Error("Please select an account");
        });


    } catch (error) {
      alert(error);
    }
  } else {
    document.querySelector(".login-btn").disabled = false;
    document.querySelector(".login-btn").innerHTML = 'Connect Wallet';
    alert("wallet not found");
  }
};


const showUserDashboard = async () => {

  // if the user is not logged in - userWalletAddress is null
  if (!window.userWalletAddress) {
    return false;
  }

window.location.href = './dashboard.html';

};



// when the user clicks the login button run the loginWithEth function
document.querySelector(".login-btn").addEventListener("click", loginWithEth);