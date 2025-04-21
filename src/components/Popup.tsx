import React, { useEffect, useState } from "react";
import { useNotesStore } from "../store/useNotesStore";
import { Trash2, ExternalLink, Calendar, Quote } from "lucide-react";

interface Note {
  id: string;
  text: string;
  note: string;
  url: string;
  timestamp: string;
}

const Popup: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { deleteNote } = useNotesStore();

  useEffect(() => {
    chrome.storage.sync.get(null, (result) => {
      const allNotes: Note[] = [];
      Object.keys(result).forEach((key) => {
        if (key !== "noteIds") {
          try {
            const note = JSON.parse(result[key]);
            allNotes.push(note);
          } catch (e) {
            console.error(`Error parsing note with key ${key}:`, e);
          }
        }
      });
      setNotes(
        allNotes.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    });
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const openUrl = (url: string) => {
    chrome.tabs.create({ url });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="w-full min-w-[300px] max-w-md h-auto max-h-screen p-3 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Notes</h2>
      {notes.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">No notes saved yet</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-3">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="truncate">{formatDate(note.timestamp)}</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-start gap-1.5">
                      <Quote className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                        {note.text}
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-700">
                    <p className="text-xs leading-relaxed line-clamp-2">
                      {note.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-2 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => openUrl(note.url)}
                  className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Page
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                  title="Delete note"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Popup;
