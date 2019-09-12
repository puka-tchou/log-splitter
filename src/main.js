/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
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
  let selectedFile = [];
  let files = [];
  let folder;

  // Listen to ipc.send in index.html
  ipcMain.on("choose-file", event => {
    // Start dialog handler
    selectedFile = modalDialog(mainWindow, "open");
    if (typeof selectedFile !== "undefined") {
      // Display the file being processed
      displayProgress(
        mainWindow,
        "file-info",
        // path.parse(selectedFile[0]).base
        selectedFile[0]
      );
      // Parse the file
      const rawFile = parseFile(selectedFile[0]);
      // Split the file
      files = splitFile(rawFile);
      // Display that the process went OK
      displayProgress(mainWindow, "file-info-card", "Log is ok");
      // Display the number of matches
      displayProgress(
        mainWindow,
        "process-info",
        `${files.length} correspondances trouvées dans ${files.length} lignes`
      );
      // Send the result to ipc.renderer in index.html
    }
    event.returnValue = true;
  });

  ipcMain.on("choose-folder", event => {
    // Ask where to save the files
    folder = modalDialog(mainWindow, "save");
    // Display that the folder is OK
    displayProgress(mainWindow, "folder-info-card", "Folder is OK");
    // Display the folder chosen
    displayProgress(mainWindow, "folder-info", folder);
    event.returnValue = true;
  });

  ipcMain.on("save-file", event => {
    if (typeof folder !== "undefined") {
      // Display the progress
      displayProgress(
        mainWindow,
        "process-info",
        `Enregistrement de ${files.length} fichiers vers ${folder[0]}`
      );
      // Write the files to the disk
      writeFiles(
        path.parse(selectedFile[0]).name,
        folder[0],
        files,
        mainWindow
      );
      // Display the success
      displayProgress(
        mainWindow,
        "process-info",
        `${
          files.length
        } fichiers ont été enregistrés avec succès dans le dossier ${folder[0]}`
      );
      // Indicate that the process is done
      displayProgress(mainWindow, "process-info-card", "Processing is done");
      // Change button message
      displayProgress(mainWindow, "start-button", "restart");
    }
    event.returnValue = true;
  });
};

exports.main = main;
