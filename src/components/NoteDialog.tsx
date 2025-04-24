import React, { useEffect, useState } from "react";
import "./NoteDialog.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

declare const chrome: any;

const NoteDialog: React.FC = () => {
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handlemouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && selection && selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();

        setPosition({
          x: rect.bottom + window.scrollY + 10,
          y: rect.left + window.scrollX,
        });

        setSelectedText(text);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("mouseup", handlemouseUp);

    return () => {
      document.removeEventListener("mouseup", handlemouseUp);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (note.trim()) {
      const noteId = crypto.randomUUID();

      const newNote = {
        id: noteId,
        text: selectedText,
        note: note,
        url: window.location.href,
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
      <DialogTrigger>
        {visible && (
          <Button
            style={{
              position: "fixed",
              zIndex: 10000,
              padding: "8px 12px",
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "background-color 0.2s",
            }}
          >
            Add Note
          </Button>
        )}
      </DialogTrigger>
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
