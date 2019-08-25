const { dialog } = require("electron");

/**
 * Open a dialog to handle file uploading
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
