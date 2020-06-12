// eslint-disable-next-line import/no-extraneous-dependencies
const {ipcRenderer} = require('electron');

const selectFile = document.querySelector('#select-file');
const selectFolder = document.querySelector('#select-folder');
const startButton = document.querySelector('#start-button');
const fileCard = document.querySelector('#file-card');
const folderCard = document.querySelector('#folder-card');
const processCard = document.querySelector('#process-card');

let processStatus = 'none';
let file = false;
let folder = false;

// Prints the provided message in the DOM
const displayMessage = (target, message) => {
	const container = document.getElementById(target);
	// Check if the container is a button
	// Clean the container
	container.innerHTML = '';
	// Clean the message
	// TODO: escape sensible characters
	if (container.nodeName === 'BUTTON') {
		container.textContent = message;
	} else {
		// Create a new "p"
		const element = document.createElement('p');
		// Create a new textNode and append it to the "p"
		const content = document.createTextNode(message);
		element.append(content);
		// Add the new "p" to the container
		container.append(element);
	}
};

const resetState = () => {
	// Reset gloabal variables
	processStatus = 'none';
	file = false;
	folder = false;
	// Reset classes of HTML elements
	fileCard.className = 'card';
	folderCard.className = 'card';
	processCard.className = 'card start-step';
	// Reset the text content
	displayMessage('file-info-card', 'This is the log');
	displayMessage('folder-info-card', 'This is the destination');
	displayMessage('process-info-card', 'Start Processing');
	// Reset the buttons labels
	displayMessage('select-file', 'open');
	displayMessage('select-folder', 'open');
	displayMessage('start-button', 'start');
	// Reset processus informations
	displayMessage('file-info', '');
	displayMessage('folder-info', '');
	displayMessage('process-info', '');
};

const activateStartButton = () => {
	// Reset state
	processCard.classList.remove('ready', 'valid');
	if (file && folder) {
		// Set the processing state to "ready"
		processStatus = 'ready';
		// Change state of the card to "ready"
		processCard.classList.add('ready');
		// Enable start button
		startButton.disabled = false;
		// Listen to "click" event on goButton
		startButton.addEventListener('click', event => {
			console.log(processStatus);
			switch (processStatus) {
				case 'ready':
					// Wait for the main process to write the files
					ipcRenderer.sendSync('save-file', event);
					// Remove yellow
					processCard.classList.remove('ready');
					// Turn to green
					processCard.classList.add('valid');
					// Set the processStatus do "done"
					processStatus = 'done';
					console.log(processStatus);
					break;
				case 'done':
					console.log('Should reset');
					resetState();
					break;
				default:
					console.log('Case not supported, this is probably an error');
					break;
			}
		});
	}
};

// Listen to "click" event on file selection
selectFile.addEventListener('click', event => {
	// Reset state
	fileCard.classList.remove('valid');
	// Send the data to the main process
	file = ipcRenderer.sendSync('choose-file', event);
	if (file) {
		// Turn to green
		fileCard.classList.add('valid');
		// Change button message
		displayMessage('select-file', 'change');
		// Try to activate the start button
		activateStartButton();
	}
});

// Listen to "click" event on folder selection
selectFolder.addEventListener('click', event => {
	// Reset state
	folderCard.classList.remove('valid');
	// Send event
	folder = ipcRenderer.sendSync('choose-folder', event);
	if (folder) {
		// Turn to green
		folderCard.classList.add('valid');
		// Change button message
		displayMessage('select-folder', 'change');
		// Try to activate the start button
		activateStartButton();
	}
});

// Calls the displayMessage each time the main process sends a message
ipcRenderer.on('progressUpdate', (event, target, message) => {
	displayMessage(target, message);
});
