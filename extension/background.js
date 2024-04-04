chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content_script.js']
  });
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (!details.url.endsWith('.mp3')) return;
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: 'exercise_voice', url: details.url });
    });
  },
  { urls: ["https://www.projet-voltaire.fr/*"] },
  []
);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'mute_tab') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.update(tab.id, { muted: true });
    });
  }
});