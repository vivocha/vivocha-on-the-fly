import { MatchingAccount } from './types';

const uuid: string = "2bee4260-edf9-11e1-bbcd-0002a5d5c51b";

function removePreviousScript(): HTMLElement {
  const scripts = document.getElementsByTagName('script');
  let found, parentNode;
  for (let i = 0; scripts && i < scripts.length; i++) {
    const script = scripts[i];
    const url = script.src;
    const check = url.match(/\/a\/(\w*)\/(api|apps|widgetwrap)\/(console\/)?(vivocha|dataframe)?/);
    if (check && check.length > 1) {
      parentNode = script.parentNode as HTMLElement;
      parentNode.removeChild(script);
      found = true;
    }
  }
  return parentNode;
}

function removeDataFrame() {
  const frame = document.getElementById('vivocha_data')
  if (frame) {
    const parentNode = frame.parentNode;
    parentNode.removeChild(frame);
  }
}

function insertScript(account: string, world: string) {
  let script = document.getElementById(uuid);

  if (!script) {
    delete (window as any).vivocha;
    removeDataFrame();
    const parentNode: HTMLElement = removePreviousScript() || document.body;
    script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('id', uuid);
    const domain = world ? world : 'www.vivocha.com';
    script.setAttribute('src', `https://${domain}/a/${account}/api/vivocha.js`);
    parentNode.appendChild(script);
  }
}

function checkInsert() {
  const script = document.getElementById(uuid);
  if (script) {
    chrome.runtime.sendMessage({ message: "vivocha-enabled" });
  } else {
    chrome.runtime.sendMessage({ message: "vivocha-disabled" });
  }
}

function requestAccount() {
  chrome.runtime.sendMessage({ message: "waiting-account" }, (response: MatchingAccount) => {
    if (response?.account) {
      insertScript(response.account, response.world);
    }
    checkInsert();
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "update-vivocha-state") {
    checkInsert();
  }
});

try {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(requestAccount, 1);
  } else {
    document.addEventListener("DOMContentLoaded", requestAccount);
  }
} catch (e) {
  console.error(e);
}