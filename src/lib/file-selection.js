const { dialog } = require("electron");

/**
 * Open a modal dialog to select a file
 * @param {BrowserWindow} mainWindow The window to attach the dialog to
 * @returns {Array} An array containing the path to the file
 */
const selectFile = mainWindow => {
  let selectedFile = [];
  try {
    // Open the dialog
    selectedFile = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openFile"]
    });
  } catch (error) {
    return error;
  }
  return selectedFile;
};

module.exports = { selectFile: selectFile };
