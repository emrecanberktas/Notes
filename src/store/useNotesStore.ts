import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Note {
  id: string;
  url: string;
  text: string;
  note: string;
  timestamp: number;
  selection: {
    startOffset: number;
    endOffset: number;
    xpath: string;
  };
}

interface NotesStore {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "timestamp">) => void;
  deleteNote: (id: string) => void;
  getNotesByUrl: (url: string) => Note[];
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note) => {
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      getNotesByUrl: (url) => {
        return get().notes.filter((note) => note.url === url);
      },
    }),
    {
      name: "page-notes-storage",
    }
  )
);
