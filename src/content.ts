declare const chrome: any;

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
      padding: 10px 16px;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    `;
    floatingButton!.addEventListener("mouseenter", () => {
      floatingButton!.style.transform = "translateY(-2px)";
      floatingButton!.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
    });
    floatingButton!.addEventListener("mouseleave", () => {
      floatingButton!.style.transform = "translateY(0)";
      floatingButton!.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    });
    document.body.appendChild(floatingButton);
  }

  // Get the bounding rectangle of the selection
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  floatingButton.style.top = `${rect.bottom + 10}px`;
  floatingButton.style.left = `${rect.left}px`;
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
            <h3>Add a Note</h3>
            <button class="close-button" aria-label="Close dialog">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
      @keyframes dialogFadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .note-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        backdrop-filter: blur(2px);
      }
      .note-dialog {
        background: #ffffff;
        border-radius: 16px;
        width: 90%;
        max-width: 520px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        animation: dialogFadeIn 0.3s ease forwards;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .note-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }
      .note-dialog-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
      }
      .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #6b7280;
        transition: color 0.2s;
      }
      .close-button:hover {
        color: #1f2937;
      }
      .note-dialog-content {
        padding: 24px;
      }
      .selected-text {
        margin-bottom: 20px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        font-size: 14px;
        color: #374151;
      }
      .selected-text strong {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #1f2937;
      }
      .note-input label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #1f2937;
      }
      .note-input textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        color: #374151;
        resize: vertical;
        transition: border-color 0.2s;
      }
      .note-input textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .note-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px;
        border-top: 1px solid #e5e7eb;
      }
      .cancel-button, .save-button {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .cancel-button {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        color: #374151;
      }
      .cancel-button:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }
      .save-button {
        background: linear-gradient(135deg, #3b82f6, #60a5fa);
        border: none;
        color: white;
      }
      .save-button:hover {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      @media (max-width: 640px) {
        .note-dialog {
          width: 95%;
          margin: 16px;
        }
        .note-dialog-header {
          padding: 16px;
        }
        .note-dialog-content {
          padding: 16px;
        }
        .note-dialog-footer {
          padding: 16px;
        }
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

    const setStorage = (data: Record<string, any>) =>
      new Promise<void>((resolve) =>
        chrome.storage.sync.set(data, () => resolve())
      );

    saveButton?.addEventListener("click", async () => {
      const note = (textarea as HTMLTextAreaElement)?.value || "";
      if (note.trim()) {
        const noteId = crypto.randomUUID();

        const newNote = {
          id: noteId,
          text: selectedText,
          note: note,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        };

        await setStorage({
          [noteId]: JSON.stringify(newNote),
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
