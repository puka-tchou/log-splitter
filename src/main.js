/* eslint-disable no-param-reassign */
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
    }
    event.returnValue = true;
  });

  ipcMain.on("choose-folder", event => {
    // Ask where to save the files
    folder = modalDialog(mainWindow, "save");
    displayProgress(mainWindow, folder);
    event.returnValue = true;
  });

  ipcMain.on("save-file", event => {
    if (typeof folder !== "undefined") {
      // Display the progress
      displayProgress(
        mainWindow,
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
        `${
          files.length
        } fichiers ont été enregistrés avec succès dans le dossier ${folder[0]}`
      );
    }
    event.returnValue = true;
  });
};

exports.main = main;
