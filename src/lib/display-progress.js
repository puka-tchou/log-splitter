const displayProgress = (window, message) => {
  window.webContents.send("progressUpdate", message);
};

exports.displayProgress = displayProgress;
