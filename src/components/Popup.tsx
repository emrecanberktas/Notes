import React, { useEffect, useState } from "react";
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
      chrome.storage.sync.remove(id, () => {
        setNotes(notes.filter((note) => note.id !== id));
      });
    }
  };

  return (
    <div className="w-full min-w-[320px] max-w-md h-auto p-4 bg-white font-inter">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Notes</h2>
      {notes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">No notes saved yet</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
            >
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span className="truncate">{formatDate(note.timestamp)}</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {note.text}
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-700">
                    <p className="text-sm leading-relaxed line-clamp-2">
                      {note.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => openUrl(note.url)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Page
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
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
