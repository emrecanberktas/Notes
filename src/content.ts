declare const chrome: any;

function getXPath(element: Node): string {
  if (!element.parentNode) return "";

  let siblings = element.parentNode.childNodes;
  let count = 0;
  let index = 0;

  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element) {
      index = count + 1;
      break;
    }
    if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
      count++;
    }
  }

  return (
    getXPath(element.parentNode) +
    "/" +
    element.nodeName.toLowerCase() +
    "[" +
    index +
    "]"
  );
}

let selectedText = "";
let selectedRange: Range | null = null;

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  selectedRange = selection.getRangeAt(0);
  selectedText = selection.toString().trim();

  if (!selectedText) return;

  // Create or update floating button
  let floatingButton = document.getElementById("page-notes-button");
  if (!floatingButton) {
    floatingButton = document.createElement("button");
    floatingButton.id = "page-notes-button";
    floatingButton.textContent = "Add Note";
    floatingButton.style.cssText = `
      position: fixed;
      z-index: 10000;
      padding: 8px 12px;
      background: #0ea5e9;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: system-ui;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(floatingButton);
  }

  const rect = selection.getRangeAt(0).getBoundingClientRect();
  floatingButton.style.top = `${rect.bottom + window.scrollY + 10}px`;
  floatingButton.style.left = `${rect.left + window.scrollX}px`;
  floatingButton.style.display = "block";
});

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.id === "page-notes-button" && selectedRange) {
    const selection = {
      text: selectedText,
      url: window.location.href,
      selection: {
        startOffset: selectedRange.startOffset,
        endOffset: selectedRange.endOffset,
        xpath: getXPath(selectedRange.startContainer),
      },
    };

    // Send message to extension
    chrome.runtime.sendMessage({
      type: "SHOW_NOTE_DIALOG",
      payload: selection,
    });

    // Hide the button
    target.style.display = "none";
  }
});

// Hide button when clicking elsewhere
document.addEventListener("mousedown", (e) => {
  const target = e.target as HTMLElement;
  if (target.id !== "page-notes-button") {
    const button = document.getElementById("page-notes-button");
    if (button) {
      button.style.display = "none";
    }
  }
});
