// Figure out what text was actually copied/cut.
function getCopiedText() {
  const el = document.activeElement;

  // Never record copies from password fields.
  if (el && el.tagName === 'INPUT' && el.type === 'password') return '';

  // window.getSelection() does NOT see selections inside <input>/<textarea>,
  // so read those directly to capture copies from form fields.
  if (
    el &&
    (el.tagName === 'TEXTAREA' ||
      (el.tagName === 'INPUT' && typeof el.selectionStart === 'number'))
  ) {
    const fieldText = el.value.substring(el.selectionStart, el.selectionEnd);
    if (fieldText) return fieldText;
  }

  return document.getSelection().toString();
}

function handleCopy() {
  const text = getCopiedText();
  if (text && text.trim() !== '') {
    chrome.runtime.sendMessage({ type: 'new-clipboard-text', text });
  }
}

document.addEventListener('copy', handleCopy);
document.addEventListener('cut', handleCopy);
