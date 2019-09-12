// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require("electron");

const selectFile = document.getElementById("select-file");
const selectFolder = document.getElementById("select-folder");
const startButton = document.getElementById("start-button");
const fileCard = document.getElementById("file-card");
const folderCard = document.getElementById("folder-card");
const processCard = document.getElementById("process-card");

let processStatus;
let file = false;
let folder = false;

const activateStartButton = () => {
  // Reset state
  processCard.classList.remove("ready", "valid");
  if (file && folder) {
    // Change state of the card to "ready"
    processCard.classList.add("ready");
    // Enable start button
    startButton.disabled = false;
    // Listen to "click" event on goButton
    startButton.addEventListener("click", event => {
      // Send the data to the main process
      processStatus = ipcRenderer.sendSync("save-file", event);
      if (processStatus) {
        // Remove yellow
        processCard.classList.remove("ready");
        // Turn to green
        processCard.classList.add("valid");
      }
    });
  }
};

const displayMessage = (target, message) => {
  const container = document.getElementById(target);
  // Check if the container is a button
  // Clean the container
  container.innerHTML = "";
  // Clean the message
  // TODO: escape sensible characters
  if (container.nodeName === "BUTTON") {
    container.innerText = message;
  } else {
    // Create a new "p"
    const element = document.createElement("p");
    // Create a new textNode and append it to the "p"
    const content = document.createTextNode(message);
    element.appendChild(content);
    // Add the new "p" to the container
    container.appendChild(element);
  }
};

// Listen to "click" on the file selection
selectFile.addEventListener("click", event => {
  // Reset state
  fileCard.classList.remove("valid");
  // Send the data to the main process
  file = ipcRenderer.sendSync("choose-file", event);
  if (file) {
    // Turn to green
    fileCard.classList.add("valid");
    // Change button message
    displayMessage("select-file", "change");
    // Try to activate the start button
    activateStartButton();
  }
});

selectFolder.addEventListener("click", event => {
  // Reset state
  folderCard.classList.remove("valid");
  // Send event
  folder = ipcRenderer.sendSync("choose-folder", event);
  if (folder) {
    // Turn to green
    folderCard.classList.add("valid");
    // Change button message
    displayMessage("select-folder", "change");
    // Try to activate the start button
    activateStartButton();
  }
});

ipcRenderer.on("progressUpdate", (event, target, message) => {
  displayMessage(target, message);
});
