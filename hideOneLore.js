//fetch the nonce to hide
async function newNoncetoHide(){
    let nonceObj = await getNonce(localStorage.getItem("userWalletAddress"),'HIDE_LORE');
    nonce = nonceObj.nonce;
}



// Web3 Eth Personal Signature & Hide lore function
const signAndHide = async () => {
  // check if there is global window.web3 instance
  if (window.web3) {
    document.querySelector(".hide-btn").disabled = true;
    document.querySelector(".hide-btn").innerHTML = '<span style="margin-right: 20px;" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Waiting for Sign...</span>';
    
    try {
      //clientMessage is app-specific message defined for signing the nonce. Please let hyype team know the message you are using with your client-id
      const req = clientHideMessage+nonce;  
      const from = localStorage.getItem("userWalletAddress");
      const msg = `${buffer.Buffer.from(req).toString('hex')}`;

      // get the user's ethereum account - prompts metamask to login
      const sign = await window.ethereum
        .request({
           method: 'personal_sign',
            params: [msg, from, ''],
        })
        .then((signature) => {
            let payload = {
                    "signedMessage": signature,
                    "walletAddress": from,
                    "loreId": loreId
                }
            hideConfirm(payload);
        })
        .catch(() => {
          // if the user cancels the login prompt
          document.querySelector(".hide-btn").disabled = false;
          document.querySelector(".hide-btn").innerHTML = 'Sign & Hide Lore';
          throw Error("You declined the signature in your wallet");
        });


    } catch (error) {
      alert(error);
    }
  } else {
    document.querySelector(".hide-btn").disabled = false;
    document.querySelector(".hide-btn").innerHTML = 'Sign & Hide Lore';
    alert("wallet not found");
  }
};



// when the user clicks the login button run the loginWithEth function
document.querySelector(".hide-btn").addEventListener("click", signAndHide);


//upon successful signature generation, passing a payload to hide a lore and adjust UI components around success message
async function hideConfirm(payload){
    try {
                let postResponse = await hideLore(payload);    
                if(postResponse.message) //loreId existing means a lore was posted
                {
                    document.querySelector(".hide-modal-footer").style.display = 'none';
                    document.querySelector(".confMessage").style.display = 'none';
                    document.querySelector(".successHide").style.display = 'block';
                }           
                document.querySelector(".hide-btn").innerHTML = 'Sign & Hide Lore';
                document.querySelector(".hide-btn").disabled = false;         

    } catch (error) {
      alert(error);
    }
}

