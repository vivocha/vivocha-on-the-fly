import { Mapping, MatchingAccount } from './types';

function getMapping(): Mapping {
  return JSON.parse(localStorage.getItem('VivochaOnTheFly') || '{}') as Mapping;
}

function updateHandler(tabId: number) {
  chrome.browserAction.setBadgeText({ text: '' });
  chrome.tabs.executeScript(tabId, { file: "vivocha-extension.js" });
}

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: any) => {
  //console.log('chrome.tabs.onUpdated', tabId, changeInfo);
  if (changeInfo?.status === 'complete') {
    updateHandler(tabId);
  }
});
/*
chrome.tabs.onCreated.addListener((tab) => {
  console.log('chrome.tabs.onCreated', tab.id);
  updateHandler(tab.id);
});
*/

function findMatchingAccount(url: string): MatchingAccount {
  const mp = getMapping();
  for (let acct in mp) {
    const rgx = mp[acct];
    for (let i in rgx.patterns) {
      if (url.match(rgx.patterns[i])) {
        return { 'account': acct, 'world': rgx.world };
      }
    }
  }
  return { 'account': null, 'world': null };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "waiting-account") {
    setTimeout(() => {
      const acct = findMatchingAccount(sender.tab.url);
      sendResponse({ account: acct.account, world: acct.world });
    }, 1);
  } else if (request.message == "vivocha-enabled") {
    chrome.browserAction.setIcon({ path: '/img/on_16.png' })
    //chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
    //chrome.browserAction.setBadgeText({text:'On'});
  } else if (request.message == "vivocha-disabled") {
    chrome.browserAction.setIcon({ path: '/img/off_16.png' })
    //chrome.browserAction.setBadgeBackgroundColor({color:[0, 100, 0, 0]});
    //chrome.browserAction.setBadgeText({text:'Off'});
  } else if (request.message == "vivocha-insert") {
    updateHandler(sender.tab?.id);
  }
  return true;
})

chrome.tabs.onActivated.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.tabId, { message: "update-vivocha-state" })
});