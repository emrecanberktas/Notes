# Web Page Note-Taking Tool

A Chrome extension that allows users to highlight text on any webpage, add notes to it, and save them locally. The notes are associated with the webpage URL and can be quickly viewed or managed through a popup interface.

## Features

- **Text Highlighting**: Select any text on a webpage and add a personal note to it.
- **URL-Specific Notes**: Notes are tied to the webpage URL, ensuring context is preserved.
- **Local Storage**: All notes are saved locally in the browser using Chrome's storage API.
- **Popup Interface**: View, edit, or delete your notes via an intuitive popup window.
- **Lightweight & Simple**: Built with React for a fast and responsive user experience.

## Usage (For Now)

Follow these steps to set up and use the extension locally:

1. **Clone the Repository**: Clone the project to your local machine using the command: `git clone https://github.com/emrecanberktas/Notes.git `
2. **Navigate to the Project Directory**: Move into the project folder: `cd Notes`
3. **Install Dependencies**: Install the required dependencies by running: `npm install `
4. **Build the Extension**: Create a production-ready build of the extension: `npm run build `
5. **Add the Extension to Chrome**: Load the extension in Chrome by following these steps: - Open Chrome and go to the Extensions page by typing `chrome://extensions/` in the address bar or navigating via Menu > Extensions > Manage Extensions. - Enable **Developer mode** by toggling the switch in the top-right corner. - Click the **Load unpacked** button. - Select the `dist` folder (or wherever your build output is located) from the project directory and click **Open**. - The extension should now appear in your Chrome extensions list and be ready to use!
