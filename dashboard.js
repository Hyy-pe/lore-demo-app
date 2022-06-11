let contractAddress = ''; //global contract address variable we will use later to post lore 
let token = ''; //global token id variable we will use later to post lore 
let outputData = ''; //editorjs blocks
let loreId = ''; //lore id var
let nonce = ''; // nonce used by users for specific action
const edjsParser = edjsHTML({video: videoParser}); // lore block parser for displaying the lore back

// Parse this video block in editorjs-html
function videoParser(block){
    return `<video src="${block.data.url}" controls autoplay muted></video>`;
}

// web3 logout function
const logout = () => {

  // remove the user's wallet address from local storage
  localStorage.removeItem("userWalletAddress");
  localStorage.clear();
  window.location.href = './index.html';

  // show the user dashboard

};


window.onload = async (event) => {
  // check if ethereum extension is installed
  if (window.ethereum) {
    // create web3 instance
    window.web3 = new Web3(window.ethereum);
  } else {
    // prompt user to install Metamask
    alert("Please install MetaMask or any Ethereum Extension Wallet");
  }

  // 5. check if user is already logged in and has the stored userWalletAddress variable
  if(localStorage.getItem("userWalletAddress")==null)
        {
            //if not then logout
            logout();
        }
};



//wallet truncating
const walletAddressEl = document.querySelector(".wallet-address");
walletAddressEl.innerHTML = truncate(localStorage.getItem("userWalletAddress"));



// when the user clicks the logout button run the logout function
document.querySelector(".logout-btn").addEventListener("click", logout);



// display NFTs in a grid on dashboard
async function renderNFTs() {
    let nfts = await getNFTs(localStorage.getItem("userWalletAddress"));
    let htmlr = '';

    nfts.results.forEach(nft => {
        let htmlSegment = `<div class="col">
                            <div class="card shadow-sm">
                            <img class="card-img-top" src="${nft.metadata.image_preview_url}" alt="Card image cap"/>

                            <div class="card-body">
                            <p class="card-text">${nft.metadata.name}</p>
                            <div class="d-flex justify-content-between align-items-center">
                              <div class="btn-group">
                                <a href="javascript:void(0);" onclick="showEditor('${nft.metadata.name}','${nft.token_id}','${nft.asset_contract.address}','${nft.metadata.image_preview_url}');" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#editorModal">Add Lore</a>
                                <a href="`+envURL+`/${nft.asset_contract.address}/${nft.token_id}" target="_blank" class="btn btn-sm btn-outline-secondary">See on Hyype</a>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>`;

        htmlr += htmlSegment;
    });

    let container = document.querySelector('.myNFTs');
    container.innerHTML = htmlr;

}


//fetch the tags
async function renderTags(searchKey) {
    let tags = await getTags(searchKey);
    let options = '';
    
    tags.forEach(tag => {
        let htmlSegment = `<option value="${tag}">${tag}</option>
            `;
        options += htmlSegment;
    });

    let container = document.querySelector('.selectTag');
    container.innerHTML = options; 
}



//pass a loreId and see its details
async function seeLoreDetails(loreId){
    try {                
                let htmlSegment = '';
                let postResponse = await getLoreDetails(loreId);
                if(postResponse.loreDetails) //loreDetails existing means a lore was posted
                {
                     let blocks = edjsParser.parse(postResponse.loreDetails);
                     blocks.forEach(block => {
                         htmlSegment += block;
                     });
                    document.querySelector('#loreDetailBlock').innerHTML = htmlSegment;
                } 

    } catch (error) {
      alert(error);
    }
}




// display Lores of the connected wallet in a feed
async function renderLores() {
    let current = Date.now();
    let loreTime = '';
    let lores = await getLoresByWallet(localStorage.getItem("userWalletAddress"));
    let htmlr = '';
    let loreImage = '';
    let loreText = '';

    lores.forEach(lore => {
        
        loreTime = timeDifference(current,lore.createdAt*1000);
        if(lore.previewImageUrl){
        loreImage = `<div class="feed-image p-3 px-3"><img class="img-fluid img-responsive" src="${lore.previewImageUrl}"></div>`;
        } else { loreImage = ''; } 

        if(lore.previewText){
        loreImage = `<div class="p-3 px-3"><span>${lore.previewText}</span></div>`;
        } else { loreText = ''; } 


        let htmlSegment = `<div class="bg-white border mt-4">
                                    <div>
                                        <div class="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                                            <div class="d-flex flex-row align-items-center feed-text px-2">
                                                <img class="rounded-circle" src="${lore.taggedToken.metadata.cachedMedia.imageUrl}" width="45">
                                                <div class="d-flex flex-column flex-wrap ml-2" style="margin-left: 10px;">
                                                    <span><b>${lore.author.userName}</b> for <b>${lore.taggedToken.metadata.name}</b></span>
                                                    <span class="text-black-50 time">${loreTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="p-3 px-3">
                                        <span style="padding: 4px 10px;border-radius: 4px;background: #fff6db;">
                                        ${lore.type}
                                        </span>
                                    </div>`+

                                    loreImage + loreText +

                                    `<div class="p-3 px-3">
                                      <div class="btn-group">
                                        <a href="javascript:void(0);" onclick="showConfirm('${lore.taggedToken.metadata.name}','${lore._id}');" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#editorModal">Hide Lore</a>
                                        <a href="javascript:void(0);" onclick="showLoreDetails('${lore.taggedToken.metadata.name}','${lore.taggedToken.metadata.cachedMedia.imageUrl}','${lore._id}');" class="btn btn-sm btn-outline-secondary">See Lore</a>
                                      </div>
                                    </div>
                                    
                            </div>`;

        htmlr += htmlSegment;
    });

    let container = document.querySelector('.myLores');
    container.innerHTML = htmlr;
    document.querySelector('.loreLoader').style.display = 'none';
}






// initialise the dialog with right contextual nft information
async function showEditor(nftname,token_id,contract_id,imageURL) {

    contractAddress = contract_id;
    token = token_id;
    document.querySelector(".nftName").innerHTML = 'Write Lore for '+nftname;
    document.querySelector(".nftPic").src = imageURL;
    document.querySelector(".modal-footer").style.display = 'block';
    document.querySelector("#editorjs").style.display = 'block';
    document.querySelector("#successMessage").style.display = 'none';
    renderTags(contract_id);
    //clear the editor data and initialise with an empty block
    editor.clear();
    newNoncetoPost();

    $('#editorModal').modal('show');
}



// hide dialog with right contextual nft information
async function showConfirm(nftname,lore_id) {
    document.querySelector(".nftName1").innerHTML = 'Hide Lore for '+nftname;
    newNoncetoHide();
    loreId = lore_id;
    document.querySelector(".hide-modal-footer").style.display = 'block';
    document.querySelector(".confMessage").style.display = 'block';
    document.querySelector(".successHide").style.display = 'none';
    $('#hideModal').modal('show');
}


// show lore details entered by the user
async function showLoreDetails(nftname,imageURL,loreblock) {

    document.querySelector("#nftNameLoreDetail").innerHTML = nftname;
    document.querySelector("#loreDetailBlock").innerHTML = '';
    document.querySelector("#nftPic1").src = imageURL;
    document.querySelector("#loreDetailBlock").style.display = 'block';
    seeLoreDetails(loreblock); // render the loreblock inside the #loredetailblock div

    $('#detailModal').modal('show');
}




let hideModalEl = document.getElementById('hideModal')
hideModalEl.addEventListener('hidden.bs.modal', function (event) {
  renderLores();
})


let loreModalEl = document.getElementById('editorModal')
loreModalEl.addEventListener('hidden.bs.modal', function (event) {
  renderLores();
})



renderNFTs();
renderLores();
