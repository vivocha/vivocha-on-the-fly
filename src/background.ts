import { Mapping, MatchingAccount } from './types';

async function getMapping(): Promise<Mapping> {
  return chrome.storage.local.get();
}

async function updateHandler(tabId: number) {
  chrome.action.setBadgeText({ text: '' });
  chrome.scripting.executeScript({
    target: {tabId},
    files: ["vivocha-extension.js"],
  });
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
async function findMatchingAccount(url: string): Promise<MatchingAccount> {
  const mp = await getMapping();
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
    setTimeout(async () => {
      const acct = await findMatchingAccount(sender.tab.url);
      sendResponse({ account: acct.account, world: acct.world });
    }, 1);
  } else if (request.message == "vivocha-enabled") {
    chrome.action.setIcon({ path: '/img/on_16.png' })
    //chrome.action.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
    //chrome.action.setBadgeText({text:'On'});
  } else if (request.message == "vivocha-disabled") {
    chrome.action.setIcon({ path: '/img/off_16.png' })
    //chrome.action.setBadgeBackgroundColor({color:[0, 100, 0, 0]});
    //chrome.action.setBadgeText({text:'Off'});
  } else if (request.message == "vivocha-insert") {
    updateHandler(sender.tab?.id);
  }
  return true;
})

chrome.tabs.onActivated.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.tabId, { message: "update-vivocha-state" })
});