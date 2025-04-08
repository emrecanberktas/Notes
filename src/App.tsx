import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { useNotesStore } from "./store/useNotesStore";
import { formatDistanceToNow } from "date-fns";

function App() {
  const { notes, deleteNote, addNote } = useNotesStore();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [newNote, setNewNote] = useState("");
  const [selectedText, setSelectedText] = useState<{
    text: string;
    selection: { startOffset: number; endOffset: number; xpath: string };
  } | null>(null);

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "SHOW_NOTE_DIALOG") {
        setSelectedText(message.payload);
      }
    });
  }, []);

  const pageNotes = notes.filter((note) => note.url === currentUrl);

  console.log(pageNotes);

  const handleAddNote = () => {
    if (selectedText && newNote) {
      addNote({
        url: currentUrl,
        text: selectedText.text,
        note: newNote,
        selection: selectedText.selection,
      });
      setNewNote("");
      setSelectedText(null);
    }
  };

  return (
    <div className="w-[400px] p-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Notes</CardTitle>
          <CardDescription>Your notes for this page</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedText && (
            <div className="mb-4 space-y-2">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">Selected Text:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedText.text}
                  </p>
                  <Textarea
                    placeholder="Add your note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mt-2"
                  />
                  <Button onClick={handleAddNote} className="mt-2">
                    Save Note
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <ScrollArea className="h-[300px]">
            {pageNotes.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No notes for this page yet
              </p>
            ) : (
              <div className="space-y-4">
                {pageNotes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{note.text}</p>
                          <p className="text-sm text-muted-foreground">
                            {note.note}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(note.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
