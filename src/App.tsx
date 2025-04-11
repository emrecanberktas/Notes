import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { useNotesStore } from "./store/useNotesStore";
import Popup from "./components/Popup";

function App() {
  const { addNote } = useNotesStore();
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
            <Popup />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
