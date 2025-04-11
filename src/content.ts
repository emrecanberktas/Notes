declare const chrome: any;

// function getXPath(element: Node): string {
//   if (!element.parentNode) return "";

//   let siblings = element.parentNode.childNodes;
//   let count = 0;
//   let index = 0;

//   for (let i = 0; i < siblings.length; i++) {
//     let sibling = siblings[i];
//     if (sibling === element) {
//       index = count + 1;
//       break;
//     }
//     if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
//       count++;
//     }
//   }

//   return (
//     getXPath(element.parentNode) +
//     "/" +
//     element.nodeName.toLowerCase() +
//     "[" +
//     index +
//     "]"
//   );
// }

let selectedText = "";
let selectedRange: Range | null = null;

// Create a container for the note dialog
const dialogContainer = document.createElement("div");
dialogContainer.id = "page-notes-dialog-container";
document.body.appendChild(dialogContainer);

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
      transition: background-color 0.2s;
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
    const dialog = document.createElement("div");
    dialog.id = "page-notes-dialog";
    dialog.innerHTML = `
      <div class="note-dialog-overlay">
        <div class="note-dialog">
          <div class="note-dialog-header">
            <h3>Add Note</h3>
            <button class="close-button">×</button>
          </div>
          <div class="note-dialog-content">
            <div class="selected-text">
              <strong>Selected Text:</strong>
              <p>${selectedText}</p>
            </div>
            <div class="note-input">
              <label for="note">Your Note:</label>
              <textarea id="note" placeholder="Write your note here..." rows="5"></textarea>
            </div>
          </div>
          <div class="note-dialog-footer">
            <button class="cancel-button">Cancel</button>
            <button class="save-button">Save Note</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .note-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
      }
      .note-dialog {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .note-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
      }
      .note-dialog-content {
        padding: 16px;
      }
      .selected-text {
        margin-bottom: 16px;
        padding: 12px;
        background: #f3f4f6;
        border-radius: 4px;
      }
      .note-input textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        resize: vertical;
      }
      .note-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px;
        border-top: 1px solid #e5e7eb;
      }
      .cancel-button, .save-button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }
      .cancel-button {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
      }
      .save-button {
        background: #0ea5e9;
        border: none;
        color: white;
      }
    `;
    document.head.appendChild(style);

    dialogContainer.appendChild(dialog);

    // Add event listeners
    const closeButton = dialog.querySelector(".close-button");
    const cancelButton = dialog.querySelector(".cancel-button");
    const saveButton = dialog.querySelector(".save-button");
    const textarea = dialog.querySelector("textarea");

    const closeDialog = () => {
      dialog.remove();
      style.remove();
    };

    closeButton?.addEventListener("click", closeDialog);
    cancelButton?.addEventListener("click", closeDialog);

    const getStorage = (key: string) =>
      new Promise<string>((resolve) =>
        chrome.storage.sync.get([key], (result: any) =>
          resolve(result[key] as string)
        )
      );
    const setStorage = (data: Record<string, any>) =>
      new Promise<void>((resolve) =>
        chrome.storage.sync.set(data, () => resolve())
      );

    saveButton?.addEventListener("click", async () => {
      const note = (textarea as HTMLTextAreaElement)?.value || "";
      if (note.trim()) {
        const noteId = crypto.randomUUID();
        const storedNotes = await getStorage("noteIds");
        const noteIds = storedNotes ? JSON.parse(storedNotes as string) : [];
        noteIds.push(noteId);

        const newNote = {
          id: noteId,
          text: selectedText,
          note: note,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        };

        await setStorage({
          [noteId]: JSON.stringify(newNote),
          noteIds: JSON.stringify(noteIds),
        });
        closeDialog();
      } else {
        closeDialog();
      }
    });

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
