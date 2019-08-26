const path = require("path");
const fs = require("fs");

/**
 * Parse a file and return an object
 * @param {String} rawPath The path of the file to parse
 */
const parseFile = rawPath => {
  let fileByLine = [];
  try {
    // Normalize path
    const truePath = path.normalize(rawPath);
    // Read raw file content as a string
    const fileContent = fs.readFileSync(truePath, "utf8");
    // Split raw file into an array at each line break
    fileByLine = fileContent.split(/\r\n|\n/);
  } catch (error) {
    return error;
  }
  return fileByLine;
};
module.exports = { parseFile: parseFile };
