/**
 * Split the files in chunks
 * @param {Array} file An array containing each line of the original file
 * @returns {Array} An array of array
 */
const splitFile = file => {
  const regex = /(?:^|\W)ffmpeg init(?:$|\W)/gm;
  const files = [];

  let processedFile = file;
  let endIndex = 0;
  do {
    // Find the endIndex (the line where "ffmpeg init" is written)
    endIndex = processedFile.findIndex(line => {
      return regex.test(line);
    });
    // Slice the original array from start (included) to end (not included)
    // and store it
    files.push(processedFile.slice(0, endIndex));
    // Remove the content
    processedFile.splice(0, endIndex);
    // Repeat
  } while (endIndex !== -1);
  // Remove the first empty element
  files.shift();
  return files;
};

module.exports = { splitFile: splitFile };
