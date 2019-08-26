/**
 * Split the files in chunks
 * @param {Array} file An array containing each line of the original file
 * @returns {Array} An array of array
 */
const splitFile = file => {
  let originalFile = file;
  // Define regular expression
  const regex = /(?:^|\W)ffmpeg init(?:$|\W)/gm;
  // Define an empty array to store the chunks of text
  const files = [];
  // Define startIndex at 0
  let startIndex = 0,
    endIndex = 0;
  do {
    // Find the endIndex (the line where "ffmpeg init" is written)
    endIndex = originalFile.findIndex((line, startIndex) => {
      return regex.test(line);
    });
    // Slice the original array from start (included) to end (not included)
    // and store it
    files.push(originalFile.slice(startIndex, endIndex));
    // Switch start to end
    startIndex = endIndex;
    // Replace the original content with the remaining
    originalFile = originalFile.slice(startIndex);
    // Repeat
  } while (endIndex !== -1);
  return files;
};

module.exports = { splitFile: splitFile };
