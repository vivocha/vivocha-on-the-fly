
var uuid ='2bee4260-edf9-11e1-bbcd-0002a5d5c51b';

function removePreviousScript () {
  var scripts = document.getElementsByTagName('script');
  var found, parentNode;
  for (var i = 0; scripts && i < scripts.length; i++) {
    var script = scripts[i];
    var url = script.src;
    var check = url.match(/\/a\/(\w*)\/(api|apps|widgetwrap)\/(console\/)?(vivocha|dataframe)?/);
    if (check && check.length > 1) {
      parentNode = script.parentNode;
      parentNode.removeChild(script);
      found = true;
    }
  }
  return parentNode;
}

function removeDataFrame() {
  var frame = document.getElementById('vivocha_data')
  if(frame) {
    var parentNode = frame.parentNode;
    parentNode.removeChild(frame);
  }
}

function insertScript(account, world) {

  var script = document.getElementById(uuid);

  if (!script) {
    delete window.vivocha;
    removeDataFrame();
    var parentNode = removePreviousScript() || document.body;
    script = document.createElement('script');
    script.setAttribute('type', 'text/javascript'); 
    script.setAttribute('id', uuid);
    var domain = world ? world : 'www.vivocha.com';
    script.setAttribute('src', '//' + domain + '/a/' + account + '/api/vivocha.js');
    parentNode.appendChild(script);
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
