
//fetch the nonce to create
async function newNoncetoPost(){
    let nonceObj = await getNonce(localStorage.getItem("userWalletAddress"),'CREATE_LORE');
    nonce = nonceObj.nonce;
}



// saving editorjs data 
async function saveData(){
    editor.save().then((output) => {
            outputData = output;
            }).catch((error) => {
                return false;
            });
}


//upon successful signature generation, passing a payload to finally post a lore
async function newPost(signature){
    try {
            let address = localStorage.getItem("userWalletAddress");
            let loreTag = document.querySelector(".selectTag").value;

                let payload = {
                    "signedMessage": signature,
                    "walletAddress": address,
                    "lore": {
                    "type": loreTag,
                    "tokenId": token,
                    "contractAddress": contractAddress,
                    "loreDetails": outputData
                    }
                }
                
                let postResponse = await postLore(payload);
                if(postResponse.loreId) //loreId existing means a lore was posted
                {
                    document.querySelector(".modal-footer").style.display = 'none';
                    document.querySelector("#editorjs").style.display = 'none';
                    document.querySelector("#successMessage").style.display = 'block';
                } 
                document.querySelector(".post-btn").innerHTML = 'Sign & Post Lore';
                document.querySelector(".post-btn").disabled = false;

    } catch (error) {
      alert(error);
    }
}



// Web3 Eth Personal Signature & Post a lore function
const signAndPost = async () => {
  //lets try and save all the editor data first
  saveData();
  // check if there is global window.web3 instance
  if (window.web3) {
    document.querySelector(".post-btn").disabled = true;
    document.querySelector(".post-btn").innerHTML = '<span style="margin-right: 20px;" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Waiting for Sign...</span>';
    
    try {
      //clientMessage is app-specific message defined for signing the nonce. Please let hyype team know the message you are using with your client-id
      const req = clientPostMessage+nonce;  
      const from = localStorage.getItem("userWalletAddress");
      const msg = `${buffer.Buffer.from(req).toString('hex')}`;

      // get the user's ethereum account - prompts metamask to login
      const sign = await window.ethereum
        .request({
           method: 'personal_sign',
            params: [msg, from, ''],
        })
        .then((signature) => {
            newPost(signature);
        })
        .catch(() => {
          // if the user cancels the login prompt
          document.querySelector(".post-btn").disabled = false;
          document.querySelector(".post-btn").innerHTML = 'Sign & Post Lore';
          throw Error("You declined the signature in your wallet");
        });


    } catch (error) {
      alert(error);
    }
  } else {
    document.querySelector(".post-btn").disabled = false;
    document.querySelector(".post-btn").innerHTML = 'Sign & Post Lore';
    alert("wallet not found");
  }
};


// when the user clicks the login button run the loginWithEth function
document.querySelector(".post-btn").addEventListener("click", signAndPost);
