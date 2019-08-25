const path = require("path");
const fs = require("fs");

/**
 * Parse a file and return an object
 * @param {String} rawPath The path of the file to parse
 */
const parseFile = rawPath => {
  // Normalize path
  const truePath = path.normalize(rawPath);
  // Read raw file content as a string
  const fileContent = fs.readFileSync(truePath, "utf8");
  // Split raw file into an array at each line break
  const fileByLine = fileContent.split(/\r\n|\n/);
  console.log(fileByLine.length);
  fileByLine.forEach(line => {
    // Do stuff line by line
  });
};

module.exports = { parseFile: parseFile };
