
function getMapping() {
  return JSON.parse(localStorage['VivochaOnTheFly'] || '{}');
}

function updateHandler(tab) {
  chrome.browserAction.setBadgeText({text:''});
  chrome.tabs.executeScript(
    null, {file:"vivocha-extension.js"});
}

chrome.tabs.onUpdated.addListener(updateHandler);
chrome.tabs.onCreated.addListener(updateHandler);

function findMatchingAccount(url) {
  var mp = getMapping();
  //console.log('findMatchingAccount', mp);
  for(var acct in mp) {
    var rgx = mp[acct];
    //console.log('rgx', rgx);
    for (var i in rgx.patterns) {
      if (url.match(rgx[i]))
        return acct;
    }
  }
  return null;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "waiting-account") {
    sendResponse({account: findMatchingAccount(sender.tab.url), world: 'viganov.vivocha.com' });
  } else if (request.message == "vivocha-enabled") {
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
    chrome.browserAction.setBadgeText({text:'On'});
  } else if (request.message == "vivocha-disabled") {
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 100, 0, 0]});
    chrome.browserAction.setBadgeText({text:'Off'});
  } else if (request.message == "vivocha-insert") {
    updateHandler();
  }
});

chrome.tabs.onActivated.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.tabId, {message: "update-vivocha-state"})
});

