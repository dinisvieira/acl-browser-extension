function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();
  
    let data = [];
    filter.ondata = event => {
        data.push(event.data);
    }

    filter.onstop = event => {
        let str = "";
        if (data.length == 1) {
          str = decoder.decode(data[0]);
        }
        else {
          for (let i = 0; i < data.length; i++) {
            let stream = (i == data.length - 1) ? false : true;
            str += decoder.decode(data[i], {stream});
          }
        }
        
        filter.write(encoder.encode(str));
        saveInStorage("reservas-data-json", str);
        console.log("reservas-acl.js: request reservas saved.");
        filter.close();
      };
  
    return {};
}

function saveInStorage(key, value) {
    var result = browser.storage.local.set({ [key] : value });
}

console.log("reservas-acl.js: extension initializing.");

if(!browser.webRequest.onBeforeRequest.hasListener(listener))
{
    console.log("reservas-acl.js: onBeforeRequest listener going to be added.");
    browser.webRequest.onBeforeRequest.addListener(
        listener,
        {urls: ["https://app.aeroclubeleiria.pt/api/reservas"], types: ["xmlhttprequest"]},
        ["blocking"]
    );
    console.log("reservas-acl.js: onBeforeRequest listener added.");
}
else{
    console.log("reservas-acl.js: onBeforeRequest listener already configured.");
}

function openReservasPage() {
    browser.tabs.create({
        "url": "reservas/reservas.html"
    });
}

/*
Initialize the page action: set icon and title, then show.
*/
function initializePageAction(tab) {
    if (tab.url === "https://app.aeroclubeleiria.pt/#/reservas/") {
        browser.pageAction.show(tab.id);
    }
    else{
        browser.pageAction.hide(tab.id);
    }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
    gettingAllTabs.then((tabs) => {
    for (let tab of tabs) {
        initializePageAction(tab);
    }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

browser.pageAction.onClicked.addListener(openReservasPage);