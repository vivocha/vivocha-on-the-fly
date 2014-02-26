
var uuid ='2bee4260-edf9-11e1-bbcd-0002a5d5c51b';

function insertScript(account, world) {

  var script = document.getElementById(uuid);

  if (!script) { 
    var body = document.getElementsByTagName('body')[0]; 
    script = document.createElement('script');  
    script.setAttribute('type', 'text/javascript'); 
    script.setAttribute('id', uuid);
    var domain = world ? world : 'www.vivocha.com';
    script.setAttribute('src', '//' + domain + '/a/' + account + '/api/vivocha.js'); 
    body.appendChild(script);
  }

}

function checkInsert() {

  var script = document.getElementById(uuid);

  if (script) {
    chrome.extension.sendMessage({ message: "vivocha-enabled"});
  } else {
    chrome.extension.sendMessage({ message: "vivocha-disabled"});
  }

}

function requestAccount() {

  chrome.extension.sendMessage({ message: "waiting-account"}, function(response) {
    if (response.account)
      insertScript(response.account, response.world);
    
    checkInsert()

  });

}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "update-vivocha-state") {
    checkInsert();
  } 
});

// Try to insert it if we missed document load event
requestAccount();

try {
  // Try to insert later, during the document load event
  document.addEventListener('DOMContentLoaded', function () {
    requestAccount();
  });
} catch(e) {}
