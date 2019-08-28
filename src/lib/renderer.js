// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require("electron");

const uploadButton = document.getElementById("drop-zone");
const selectFolderButton = document.getElementById("select-folder");
const goButton = document.getElementById("go-button");

let fileChosen = false;
let folderChosen = false;

const activateStartButton = () => {
  if (fileChosen === true && folderChosen === true) {
    goButton.className = "button-container enabled";
    // Listen to "click" event on goButton
    goButton.addEventListener("click", event => {
      // Send the data to the main process
      ipcRenderer.sendSync("save-file", event);
    });
  }
};

// Listen to "click" event on uploadButton
uploadButton.addEventListener("click", event => {
  // Send the data to the main process
  fileChosen = ipcRenderer.sendSync("choose-file", event);
  activateStartButton();
});

selectFolderButton.addEventListener("click", event => {
  folderChosen = ipcRenderer.sendSync("choose-folder", event);
  activateStartButton();
});

ipcRenderer.on("progressUpdate", (event, target, message) => {
  const element = document.getElementById(target);
  element.innerText = message;
});
