import React, { useState } from "react";
import "./NoteDialog.css";

interface NoteDialogProps {
  selectedText: string;
  url: string;
  onClose: () => void;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  selectedText,
  url,
  onClose,
}) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    const notes = JSON.parse(localStorage.getItem("pageNotes") || "[]");
    const newNote = {
      id: Date.now(),
      text: selectedText,
      note,
      url,
      timestamp: new Date().toISOString(),
    };
    notes.push(newNote);
    localStorage.setItem("pageNotes", JSON.stringify(notes));
    onClose();
  };

  return (
    <div className="note-dialog-overlay">
      <div className="note-dialog">
        <div className="note-dialog-header">
          <h3>Add Note</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="note-dialog-content">
          <div className="selected-text">
            <strong>Selected Text:</strong>
            <p>{selectedText}</p>
          </div>
          <div className="note-input">
            <label htmlFor="note">Your Note:</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note here..."
              rows={5}
            />
          </div>
        </div>
        <div className="note-dialog-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDialog;
