chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content_script.js']
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'mute_tab') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.update(tab.id, { muted: true });
    });
  }
});
