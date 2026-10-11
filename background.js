// Maximum number of history items to keep
const MAX_HISTORY = 50;

// Older versions stored plain strings; new entries are { text, time } objects.
function normalize(item) {
  return typeof item === 'string' ? { text: item, time: 0 } : item;
}

// Listen for messages from content script
let saveChain = Promise.resolve();

function enqueueSave(text) {
  saveChain = saveChain
    .then(() => saveToHistory(text))
    .catch((error) => console.error('Clip Story save failed', error));
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'new-clipboard-text') {
    enqueueSave(message.text);
  }
});

async function saveToHistory(text) {
  if (!text || text.trim() === '') return;

  const result = await chrome.storage.local.get(['clipboardHistory']);
  let history = (result.clipboardHistory || []).map(normalize);

  // Drop any existing copy of this text, then push it to the top.
  history = history.filter((item) => item.text !== text);
  history.unshift({ text, time: Date.now() });

  // Keep only the most recent MAX_HISTORY items
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);

  await chrome.storage.local.set({ clipboardHistory: history });
}
