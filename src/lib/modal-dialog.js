const { dialog } = require("electron");

/**
 * Open a modal dialog to select a file
 * @param {BrowserWindow} window The window to attach the dialog to
 * @param {String} type The type of dialog, either "open" or "save"
 * @returns {Array} An array containing the path to the file
 */
const modalDialog = (window, type) => {
  let selectedFile = [];
  try {
    // Open the dialog
    switch (type) {
      case "open":
        selectedFile = dialog.showOpenDialogSync(window, {
          title: "Ouvrir le fichier à traiter",
          properties: ["openFile"]
        });
        break;
      case "save":
        selectedFile = dialog.showSaveDialogSync(window, {
          title: "Choisir le dossier dans lequel écrire les fichiers"
        });
      default:
        throw `${type} is not a valid type of dialog`;
    }
  } catch (error) {
    return error;
  }
  return selectedFile;
};

module.exports = { modalDialog: modalDialog };
