const electron = require('electron');
const app = electron.app;

app.setName('electron-settings-gui-demo');

app.on('ready', function () {

    const mainWindow = new electron.BrowserWindow();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });

});
