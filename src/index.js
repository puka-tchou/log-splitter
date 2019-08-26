const { app, BrowserWindow, ipcMain } = require("electron");

const { modalDialog } = require("./lib/modal-dialog"); // Dialog handler
const { parseFile } = require("./lib/parse-file"); // File parser
const { splitFile } = require("./lib/split-file"); // File splitter

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

// Listen to ipc.send in index.html
ipcMain.on("choose-file", (event, data) => {
  // Start dialog handler
  const selectedFile = modalDialog(mainWindow, "open");
  // Parse the file
  const file = parseFile(selectedFile[0]);
  // Display the number of lines
  console.debug(`Recherche de correspondance dans ${file.length} lignes...`);
  // Split the file
  const files = splitFile(file);
  // Display the number of matches
  console.debug(`${files.length} correspondances trouvées`);
  // Send the result to ipc.renderer in index.html
  event.returnValue = true;
});
