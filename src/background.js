console.log("Reservas ACL 'background.js': extension initializing.");

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