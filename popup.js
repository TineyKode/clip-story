let allHistory = [];

// Older versions stored plain strings; new entries are { text, time } objects.
function normalize(item) {
  return typeof item === 'string' ? { text: item, time: 0 } : item;
}

async function loadHistory() {
  const result = await chrome.storage.local.get(['clipboardHistory']);
  allHistory = (result.clipboardHistory || []).map(normalize);
  render();
}

function render() {
  const listElement = document.getElementById('historyList');
  const query = document.getElementById('search').value.trim().toLowerCase();
  const items = query
    ? allHistory.filter((item) => item.text.toLowerCase().includes(query))
    : allHistory;

  listElement.innerHTML = '';

  if (allHistory.length === 0) {
    showEmpty(listElement, 'No copied items yet. Copy some text from any webpage.');
    return;
  }
  if (items.length === 0) {
    showEmpty(listElement, 'No matches.');
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'history-item';

    const textDiv = document.createElement('div');
    textDiv.className = 'history-text';
    textDiv.textContent = item.text; // textContent avoids any HTML injection
    textDiv.addEventListener('click', () => copyToClipboard(item.text));

    const meta = document.createElement('div');
    meta.className = 'history-meta';

    const time = document.createElement('span');
    time.className = 'history-time';
    time.textContent = relativeTime(item.time);

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '×';
    del.title = 'Delete';
    del.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteItem(item.text);
    });

    meta.appendChild(time);
    meta.appendChild(del);
    li.appendChild(textDiv);
    li.appendChild(meta);
    listElement.appendChild(li);
  }
}

function showEmpty(listElement, message) {
  const li = document.createElement('li');
  li.className = 'empty-message';
  li.textContent = message;
  listElement.appendChild(li);
}

function relativeTime(time) {
  if (!time) return '';
  const minutes = Math.floor((Date.now() - time) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function deleteItem(text) {
  allHistory = allHistory.filter((item) => item.text !== text);
  await chrome.storage.local.set({ clipboardHistory: allHistory });
  render();
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('✓ Copied!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

function showToast(message) {
  const statusDiv = document.createElement('div');
  statusDiv.className = 'toast';
  statusDiv.textContent = message;
  document.body.appendChild(statusDiv);
  setTimeout(() => statusDiv.remove(), 1000);
}

document.getElementById('clearAll').addEventListener('click', async () => {
  await chrome.storage.local.set({ clipboardHistory: [] });
  allHistory = [];
  render();
});

document.getElementById('search').addEventListener('input', render);

// Initial load
loadHistory();
