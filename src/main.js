const { ipcMain } = require("electron");
const path = require("path");

const { modalDialog } = require("./lib/modal-dialog");
const { parseFile } = require("./lib/parse-file");
const { splitFile } = require("./lib/split-file");
const { writeFiles } = require("./lib/write-files");
const { displayProgress } = require("./lib/display-progress");

/**
 * Core app logic
 * @param {Electron.BrowserWindow} mainWindow
 */
const main = mainWindow => {
  let selectedFile = [],
    files = [];
  // Listen to ipc.send in index.html
  ipcMain.on("choose-file", (event, data) => {
    // Start dialog handler
    selectedFile = modalDialog(mainWindow, "open");
    // Display the file being processed
    displayProgress(mainWindow, selectedFile[0]);
    // Parse the file
    const rawFile = parseFile(selectedFile[0]);
    // Display the number of lines
    displayProgress(
      mainWindow,
      `Recherche de correspondance dans ${files.length} lignes...`
    );
    // Split the file
    files = splitFile(rawFile);
    // Display the number of matches
    displayProgress(mainWindow, `${files.length} correspondances trouvées`);
    // Send the result to ipc.renderer in index.html
    event.returnValue = true;
  });
  ipcMain.on("save-file", (event, data) => {
    // Ask where to save the files
    const folder = modalDialog(mainWindow, "save");
    // Display the progress
    displayProgress(
      mainWindow,
      `Enregistrement de ${files.length} fichiers vers ${folder[0]}`
    );
    // Write the files to the disk
    writeFiles(path.parse(selectedFile[0]).name, folder[0], files, mainWindow);
    event.returnValue = true;
    displayProgress(
      mainWindow,
      `${
        files.length
      } fichiers ont été enregistrés avec succès dans le dossier ${folder[0]}`
    );
  });
};

exports.main = main;
