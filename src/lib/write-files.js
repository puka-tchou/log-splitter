const fs = require("fs");
const path = require("path");

/**
 * Write an array of files to the disk
 * @param {String} name The name of the file
 * @param {String} folder The path to the folder
 * @param {Array} files The files
 */
const writeFiles = (name, folder, files) => {
  let index = 0;
  try {
    files.forEach(file => {
      let fileName = path.join(folder, `${name}_${index.toString()}.log`);
      index++;
      console.debug(`Writing ${fileName}`);
      // Open a stream
      const stream = fs.createWriteStream(fileName, { flags: "a" });
      // Append to the file
      file.forEach(line => {
        stream.write(`${line}\n`);
      });
      // Close the stream
      stream.end();
    });
  } catch (error) {
    return error;
  }
  return true;
};

module.exports = { writeFiles: writeFiles };
