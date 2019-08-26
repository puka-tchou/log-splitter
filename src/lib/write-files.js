const fs = require("fs");
const path = require("path");

const displayProgress = require("./display-progress");

/**
 * Write an array of files to the disk
 * @param {String} name The name of the file
 * @param {String} folder The path to the folder
 * @param {Array} files The files
 * @param {Electron.BrowserWindow} mainWindow The main renderer window
 */
const writeFiles = (name, folder, files, mainWindow) => {
  let index = 1;
  try {
    files.forEach(file => {
      let fileName = path.join(folder, `${name}_${index.toString()}.log`);
      index++;
      // Open a stream
      const stream = fs.createWriteStream(fileName, { flags: "a" });
      // Append to the file
      file.forEach(line => {
        stream.write(`${line}\n`);
      });
      // Close the stream
      stream.end();
      displayProgress(mainWindow, `${index - 1}/${files.length} : ${fileName}`);
    });
  } catch (error) {
    return error;
  }
  return true;
};

exports.writeFiles = writeFiles;
