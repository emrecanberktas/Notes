import React, { useState } from "react";
import "./NoteDialog.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

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
    // <div className="note-dialog-overlay">
    //   <div className="note-dialog">
    //     <div className="note-dialog-header">
    //       <h3>Add Note</h3>
    //       <button className="close-button" onClick={onClose}>
    //         ×
    //       </button>
    //     </div>
    //     <div className="note-dialog-content">
    //       <div className="selected-text">
    //         <strong>Selected Text:</strong>
    //         <p>{selectedText}</p>
    //       </div>
    //       <div className="note-input">
    //         <label htmlFor="note">Your Note:</label>
    //         <textarea
    //           id="note"
    //           value={note}
    //           onChange={(e) => setNote(e.target.value)}
    //           placeholder="Write your note here..."
    //           rows={5}
    //         />
    //       </div>
    //     </div>
    //     <div className="note-dialog-footer">
    //       <button className="cancel-button" onClick={onClose}>
    //         Cancel
    //       </button>
    //       <button className="save-button" onClick={handleSave}>
    //         Save Note
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <strong>Selected Text:</strong>
            <p>{selectedText}</p>
          </div>
          <div>
            <Label htmlFor="note">Your Note:</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write Your Note Here"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="cancel-button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="save-button" onClick={handleSave}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
