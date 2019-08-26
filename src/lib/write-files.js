const fs = require("fs");
const path = require("path");

const writeFiles = (name, folder, files) => {
  let index = 0;

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
};

module.exports = { writeFiles: writeFiles };
