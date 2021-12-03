import { Mapping, MappingData } from './types';

let mapping: Mapping = {};

function addPattern(value: string) {
  const patterns = document.getElementById("patterns");
  const div = document.createElement("div");

  const input = document.createElement("input");
  input.setAttribute("class", "urlmatch");
  input.value = value;

  const button = document.createElement("button");
  button.setAttribute("class", "removebutton");
  button.innerText = "-";

  div.appendChild(input);
  div.appendChild(button);

  patterns.insertBefore(div, patterns.firstChild);

  button.addEventListener('click', removePatternHandler);
}

function addPatternHandler(ev: Event) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if (tabs.length > 0) {
      addPattern(tabs[0].url);
    } else {
      addPattern('.*');
    }
    saveOptions();
  });
}

function removePattern(obj: HTMLElement) {
  obj.parentNode.parentNode.removeChild(obj.parentNode);
}

function removePatternHandler(ev: Event) {
  removePattern(ev.target as HTMLElement);
  saveOptions();
}

function next(node: ChildNode, tag: string): ChildNode {
  while (node && node.nodeName !== tag) {
    node = node.nextSibling;
  }
  return node;
}

function clear() {
  const patterns = document.getElementById("patterns");
  while (patterns.firstChild) {
    patterns.removeChild(patterns.firstChild);
  }
}

function tellTabToInsertScript() {
  chrome.runtime.sendMessage({ message: "vivocha-insert" });
}

function saveOptions() {
  let pattern: ChildNode = next(document.getElementById("patterns").firstChild, 'DIV');
  const account: string = (document.getElementById("account") as HTMLInputElement).value;
  const world: string = (document.getElementById("world") as HTMLInputElement).value;

  const patterns = [];

  while (pattern) {
    const regex = (next(pattern.firstChild, "INPUT") as any).value;
    patterns.push(regex);
    pattern = next(pattern.nextSibling, "DIV");
  }

  const data: MappingData = {
    world,
    patterns
  };

  mapping = {};
  //mapping[account] = patterns;
  mapping[account] = data;
  //chrome.extension.getBackgroundPage().console.log(data);
}

async function persisteOptionsHandler() {
  saveOptions();
  await chrome.storage.local.set(mapping);
  tellTabToInsertScript();
  window.close();
}

function loadOptions() {
  clear();
  for (let i in mapping) {
    (document.getElementById("account") as HTMLInputElement).value = i;
    const data = mapping[i];
    (document.getElementById("world") as HTMLInputElement).value = data.world || 'www.vivocha.com';
    const patterns = data.patterns;
    //const patterns = mapping[i];
    for (let j in patterns) {
      addPattern(patterns[j]);
    }
  }
}

function undo() {
  mapping = JSON.parse(localStorage.getItem('VivochaOnTheFly') || '{}');
  loadOptions();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addbutton').addEventListener('click', addPatternHandler);
  document.getElementById('savebutton').addEventListener('click', persisteOptionsHandler);
  document.getElementById('undobutton').addEventListener('click', undo);
  document.getElementById('advanced').addEventListener("click", advanced, false);
  undo();
});

function advanced() {
  const el: HTMLElement = document.getElementById('world_container');
  const ad: HTMLElement = document.getElementById('advanced');
  if (ad) {
    ad.className = ad.className ? ' ' : ' selected';
  }
  if (el) {
    el.className = el.className ? ' ' : 'hidden';
  }
}