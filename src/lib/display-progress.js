const displayProgress = (window, target, message) => {
	window.webContents.send('progressUpdate', target, message);
};

exports.displayProgress = displayProgress;
