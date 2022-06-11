const envURL = 'https://sandbox.hyy.pe';
const apiURL = 'https://sandboxapi.hyy.pe';
const clientId = 'PUT_YOUR_HYYPE_CLIENT_ID_HERE';
const clientPostMessage = 'Post a lore on Hyype by verifying your wallet address. One time code : ';
const clientHideMessage = 'Hide a lore on Hyype by verifying your wallet address. One time code : ';


//wallet truncating
function truncate(addr) {
    let first = addr.substr(0,5);
    let last = addr.substr(addr.length-5);
    let str = first+'...'+last;
    return str;
}


//time ago
function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + 's ago';   
    }
    
    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + 'm ago';   
    }
    
    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + 'h ago';   
    }

    else if (elapsed < msPerMonth) {
         return Math.round(elapsed/msPerDay) + 'd ago';   
    }
    
    else if (elapsed < msPerYear) {
         return Math.round(elapsed/msPerMonth) + 'mo ago';   
    }
    else {
         return Math.round(elapsed/msPerYear ) + 'y ago';   
    }
}




// fetch the data from opensea to get first 50 user tokens
async function getNFTs(addr) {
    let url = 'https://api.opensea.io/api/v2/beta/assets?chain_identifier=ethereum&format=json&owner_address='+addr;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}



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



// fetch all the lore tags for a specific community by contract address
async function getTags(searchKey) {
    let url = apiURL+'/api/v1/community/lore-tags?searchKey='+searchKey;
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



// fetch the most recent 10 lores by the wallet owner
async function getLoresByWallet(addr) {
    let url = apiURL+'/api/v1/lores?skip=0&limit=10&walletAddress='+addr;
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
              body: JSON.stringify({'address': addr, 'action': action})
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}



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

