const {app, BrowserWindow, ipcMain} = require('electron');

const child_process = require('child_process');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });
    
    win.setMenuBarVisibility(false)
    win.loadFile('index.html')
});

ipcMain.on('trigger-transcription', (e) => {
    
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    const child = child_process.spawn(pythonCmd, ['transcribe.py']);

    child.stdout.on('data', (data) => {
        console.log('[PYTHON STDOUT]', data.toString());
    });

    child.stderr.on('data', (data) => {
        console.error('[PYTHON STDERR]', data.toString());
    });

    child.on('close', (code) => {
        e.sender.send('finished', 'process is done');
    });
});
