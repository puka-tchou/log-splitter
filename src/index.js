const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { modalDialog } = require("./lib/modal-dialog"); // Dialog handler
const { parseFile } = require("./lib/parse-file"); // File parser
const { splitFile } = require("./lib/split-file"); // File splitter
const { writeFiles } = require("./lib/write-files"); // file writer

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const main = mainWindow => {
  let selectedFile = [],
    files = [];

  // Listen to ipc.send in index.html
  ipcMain.on("choose-file", (event, data) => {
    // Start dialog handler
    selectedFile = modalDialog(mainWindow, "open");
    // Display the file being processed
    console.debug(selectedFile[0]);
    // Parse the file
    const rawFile = parseFile(selectedFile[0]);
    // Display the number of lines
    console.debug(`Recherche de correspondance dans ${files.length} lignes...`);
    // Split the file
    files = splitFile(rawFile);
    // Display the number of matches
    console.debug(`${files.length} correspondances trouvées`);
    // Send the result to ipc.renderer in index.html
    event.returnValue = true;
  });

  ipcMain.on("save-file", (event, data) => {
    // Ask where to save the files
    const folder = modalDialog(mainWindow, "save");
    // Display the progress
    console.debug(
      `Enregistrement de ${files.length} fichiers vers ${folder[0]}`
    );
    // Write the files to the disk
    writeFiles(path.parse(selectedFile[0]).name, folder[0], files);
    event.returnValue = true;
  });
};

main(mainWindow);
