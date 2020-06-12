const fs = require('fs');
const path = require('path');

/**
 * Write an array of files to the disk
 * @param {String} name The name of the file
 * @param {String} folder The path to the folder
 * @param {Array} files The files
 * @param {Electron.BrowserWindow} mainWindow The main renderer window
 */
const writeFiles = (name, folder, files) => {
	let index = 1;

	files.forEach(file => {
		const fileName = path.join(folder, `${name}_${index.toString()}`);
		// eslint-disable-next-line no-plusplus
		index++;
		// Open a stream
		const stream = fs.createWriteStream(fileName, {flags: 'a'});
		// Append to the file
		file.forEach(line => {
			stream.write(`${line}\n`);
		});
		// Close the stream
		stream.end();
	});

	return true;
};

exports.writeFiles = writeFiles;
