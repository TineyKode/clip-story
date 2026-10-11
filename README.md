# Clip Story

Manifest V3 browser extension that keeps text you copy or cut on web pages, so you can paste it again.

It does not read the system clipboard. A copy made in another app, the address bar, or a `chrome://` page is not recorded.

## What it does

- Listens for copy and cut on web pages, including iframes
- Skips password fields
- Keeps the 50 most recent unique clippings
- Search, copy an item back, delete one item, or clear the list

Click a clipping in the popup to put it back on the clipboard.

## Install

1. Open Chrome, Edge, or another Chromium browser.
2. Go to `chrome://extensions`.
3. Turn on Developer mode.
4. Choose **Load unpacked** and select this folder.

## Files

- `manifest.json` - Manifest V3
- `content.js` - records copy and cut on pages
- `background.js` - saves history one clipping at a time
- `popup.html`, `popup.js` - search and the history list
- `icon16.png`, `icon48.png`, `icon128.png` - toolbar icons

## Permissions

`storage` only. The content script runs on all web pages so it can see copy and cut. It does not ask for clipboard read or write.

## Check

```powershell
Get-Content manifest.json -Raw | ConvertFrom-Json | Out-Null
node --check background.js
node --check content.js
node --check popup.js
```
