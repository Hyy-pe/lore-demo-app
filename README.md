# Lore API Demo 
An minimal sample app written in plain js and HTML that demonstrates the workflow of writing, reading and hiding lore based on Hyy.pe POST APIs. It also displays a basic lore feed using one of the feed Endpoints. 

<img width="1536" alt="Screen Shot 2022-06-07 at 6 08 31 PM" src="https://user-images.githubusercontent.com/1647155/172509702-2f08dab7-f772-43d0-a4fd-8e6b851d90b3.png">

Check out the working Demo [here](https://lore-demo-app.vercel.app/)

---
Table of Contents

- [API methods being used](#What-API-methods-from-Hyype-are-used-inside-the-sample-codebase?)
- [External dependencies used](#External-dependencies-used-in-this-demo)
- [Before you get started](#Before-you-get-started)
- [Initialising the Editor](#Initialising-the-Editor)
- [Posting a Lore](#Post-a-lore)
- [Hiding a Lore](#Hide-a-lore)
- [Displaying Lore Details](#display-lore-details)
---
### Demo code structure explained
```
lore-demo-app
|
|
-- dashboard.html - houses the UI to display NFTs and lores 
|
-- dashboard.js - common code to display NFTs, show and hide editor and lore details modal UI
|
-- demoUtils.js - all the external API calls
|
-- editorinit.js - editorjs configuration and initialisation
|
-- index.html - web3 login (metamask only)
|
-- postOneLore.js - Signature request and payload preparation to post a Lore
|
-- hideOneLore.js - Signature request and payload preparation to hide a lore 
|
-- style.css - common css for app UI
```
---
## What API methods from Hyype are used?
#### POST
- [Request a unique Nonce](https://docs.hyy.pe/api-reference/post-methods/request-nonce) based on user action of creating a lore or hiding a lore
- [Posting new lore](https://docs.hyy.pe/api-reference/post-methods/post-lore-blocks) after signing a sample request using nonce
- [Hiding existing lore](https://docs.hyy.pe/api-reference/post-methods/hide-lore) after signing a sample request using nonce
#### GET
- [Displaying full lore](https://docs.hyy.pe/api-reference/get-methods/nft-lore-details) using a loreId
- [Fetch Lore tags](https://docs.hyy.pe/api-reference/get-methods/lore-tags-for-collection) for a given NFT collection
- [Fetch recent lores by wallet](https://docs.hyy.pe/api-reference/get-methods/all-lores-by-an-address) using wallet address

---

## External dependencies used in this demo
To reduce included library code, all of them are loaded directly via CDN
- [Editorjs](https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest) - to create loreblocks and initialise an editor to write lore
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
```
- [Editor JS blocktypes](https://docs.hyy.pe/api-reference/nft-lore-object-model/editor-lore-blocks) - all relevant blocktypes used in the code snippets Following are used
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/image@2.3.0"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/quote@latest"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
```
- Jquery and [Bootstrap](https://getbootstrap.com/) bundle only for the UI components (buttons, modals etc for this demo. Not related to the API)
- [Web3.js](https://web3js.readthedocs.io/en/v1.2.11/index.html) Ethereum JS API
- [Buffer](https://www.npmjs.com/package/buffer) Nodejs buffer API for the browser 
- [Editorjs-html](https://github.com/pavittarx/editorjs-html) Parser built to parse the loreBlocks back into HTML
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/editorjs-html@3.4.0/build/edjsHTML.js"></script>
```
- Filestack API to build a remote image uploading experience hooked into the editor without backend implementation
```
<script type="text/javascript" src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
```
- Opensea API to fetch your tokens from the connected wallet address

---
## Before you get started
- Always use our Sandbox endpoints to develop your workflow. 
```
const envURL = 'https://sandbox.hyy.pe';
const apiURL = 'https://sandboxapi.hyy.pe';
```
- You will need the client-id to access Hyype API endpoints. If you do not have one yet, you can request one [here](https://docs.hyy.pe/api-reference/api-introduction/how-to-get-a-client-id). This is accessed across all the methods in `demoUtils.js`
```
const clientId = 'YOUR_CLIENT_ID_GOES_HERE';
```
- Every action (hiding or posting lore) is a signed action by connected wallet and a unique signature payload. Learn more about defining your signature and message strings [here](https://docs.hyy.pe/api-reference/post-methods/creating-a-signed-message). Examples are below
```
const clientPostMessage = 'Post a lore on Hyype by verifying your wallet address. One time code : ';
const clientHideMessage = 'Hide a lore on Hyype by verifying your wallet address. One time code : ';
```
#### Initialising the Editor
- Inside `editorinit.js`, you will find the following code which initialises the editor inside your editor container (page or modal).
```
const editor = new EditorJS({
    holder: 'editorjs',
/** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */
   tools:{
       header:Header,
       paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      embed: Embed,
      list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      }
    },
      quote: {
      class: Quote,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+O',
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote\'s author',
      },
    },
      .... 
    }
}
);
```
In this code block you will see that it uses [Filestack API](https://www.filestack.com/) to demo image uploading. You will need your own server side implementation to have this or use EditorJS [SimpleImage](https://github.com/editor-js/simple-image) implementation instead.

---

## Post a Lore
<img width="1107" alt="Screen Shot 2022-05-31 at 12 29 47 PM" src="https://user-images.githubusercontent.com/1647155/172026287-1dd326c4-4d78-4519-ba46-1fb9fe5a452a.png">

- Using your client-id and connected wallet address, request a unique nonce from the Hyype API to prepare the correct message to sign
```
// request a one-time nonce for connected address (create or hide action supported)
async function getNonce(addr, action) {
    let url = apiURL+'/api/v1/user/public/request-nonce';
    try {
        let res = await fetch(url,{
            method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'client-id': clientId,
              },
              body: JSON.stringify({'address': addr, 'action': action}) //CREATE_LORE or HIDE_LORE
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
```
- Request the connected wallet to sign the proper message 
```
try {
      //clientMessage is app-specific message defined for signing the nonce. Please let hyype team know the message you are using with your client-id
      const req = clientPostMessage+nonce;  
      const from = localStorage.getItem("userWalletAddress"); // connected address can be stored in localStorage for example
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
          throw Error("You declined the signature in your wallet");
        });
    } catch (error) {
      alert(error);
    }
```
- Once the connected wallet has signed the message you requested, you can then prepare payload and send the POST request
```
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
```
```
// Post a lore with a signed message (pass the payload of lore with relevant data)
async function postLore(payload) {
    let url = apiURL+'/api/v1/lore/create-lore';
    try {
        let res = await fetch(url,{
            method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'client-id': clientId,
              },
              body: JSON.stringify(payload)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
```
---
## Hide a Lore
<img width="1100" alt="Screen Shot 2022-05-31 at 12 17 03 PM" src="https://user-images.githubusercontent.com/1647155/172033959-06e4a4f0-ec24-471f-a5ad-85e8501afd0d.png">

- Using your client-id and connected wallet address, request a unique nonce from the Hyype API to prepare the correct message to sign
```
// request a one-time nonce for connected address (create or hide action supported)
async function getNonce(addr, action) {
    let url = apiURL+'/api/v1/user/public/request-nonce';
    try {
        let res = await fetch(url,{
            method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'client-id': clientId,
              },
              body: JSON.stringify({'address': addr, 'action': action}) //CREATE_LORE or HIDE_LORE
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
```
- Request the connected wallet to sign the proper message (Similar to Posting a lore)
- Once the connected wallet has signed the message you requested, you can then prepare payload and send the POST request to Hide the lore
```
let payload = {
                    "signedMessage": signature,
                    "walletAddress": from,
                    "loreId": loreId
                }
```
```
// Hide a lore with a signed message (and pass the loreId)
async function hideLore(payload) {
    let url = apiURL+'/api/v1/lore/hide-lore';
    try {
        let res = await fetch(url,{
            method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'client-id': clientId,
              },
              body: JSON.stringify(payload)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
```
---
## Display Lore Details
- Request a particular lore detail by lore id
```
// fetch the lore details for a specific lore id
async function getLoreDetails(loreId) {
    let url = apiURL+'/api/v1/lore/'+loreId;
    try {
        let res = await fetch(url,{
            method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'client-id': clientId,
              }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
```
- Parse the Lore blocks into HTML and then display it via your container

```
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
```
---
Ask questions via our developers channel in the [hyype discord](https://discord.gg/cbHN3V7wvf) or create issues on this repo


