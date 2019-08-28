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
        "display-file",
        path.parse(selectedFile[0]).base
      );
      // Parse the file
      const rawFile = parseFile(selectedFile[0]);
      // Display the number of lines
      displayProgress(
        mainWindow,
        "progress-board",
        `Recherche de correspondance dans ${files.length} lignes...`
      );
      // Split the file
      files = splitFile(rawFile);
      // Display the number of matches
      displayProgress(
        mainWindow,
        "progress-board",
        `${files.length} correspondances trouvées`
      );
      // Send the result to ipc.renderer in index.html
    }
    event.returnValue = true;
  });

  ipcMain.on("choose-folder", event => {
    // Ask where to save the files
    folder = modalDialog(mainWindow, "save");
    displayProgress(mainWindow, "display-folder", folder);
    event.returnValue = true;
  });

  ipcMain.on("save-file", event => {
    if (typeof folder !== "undefined") {
      // Display the progress
      displayProgress(
        mainWindow,
        "progress-board",
        `Enregistrement de ${files.length} fichiers vers ${folder[0]}`
      );
      // Write the files to the disk
      writeFiles(
        path.parse(selectedFile[0]).name,
        folder[0],
        files,
        mainWindow
      );
      displayProgress(
        mainWindow,
        "progress-board",
        `${
          files.length
        } fichiers ont été enregistrés avec succès dans le dossier ${folder[0]}`
      );
    }
    event.returnValue = true;
  });
};

exports.main = main;
