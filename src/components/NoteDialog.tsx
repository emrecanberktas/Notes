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

declare const chrome: any;

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
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSave = async () => {
    if (note.trim()) {
      const noteId = crypto.randomUUID();

      const newNote = {
        id: noteId,
        text: selectedText,
        note,
        url,
        timestamp: new Date().toISOString(),
      };

      await new Promise<void>((resolve) =>
        chrome.storage.sync.set({ [noteId]: JSON.stringify(newNote) }, () =>
          resolve()
        )
      );

      handleClose();
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div>
          <div className="selected-text-container">
            <strong>Selected Text:</strong>
            <p>{selectedText}</p>
          </div>
          <div className="note-input-container">
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
