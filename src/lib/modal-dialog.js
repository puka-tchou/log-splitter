// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require("electron");

/**
 * Open a modal dialog to select a file
 * @param {Electron.BrowserWindow} window The window to attach the dialog to
 * @param {String} type The type of dialog, either "open" or "save"
 * @returns {Array} An array containing the path to the file
 */
const modalDialog = (window, type) => {
  let path = [];
  try {
    // Open the dialog
    switch (type) {
      case "open":
        path = dialog.showOpenDialogSync(window, {
          title: "Ouvrir le fichier à traiter",
          properties: ["openFile"]
        });
        break;
      case "save":
        path = dialog.showOpenDialogSync(window, {
          title: "Choisir le dossier dans lequel écrire les fichiers",
          properties: ["openDirectory"]
        });
        break;
      default:
        throw new Error(`${type} is not a valid type of dialog`);
    }
  } catch (error) {
    return error;
  }
  return path;
};

exports.modalDialog = modalDialog;
