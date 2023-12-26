const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('main', {
  loadDocxFile: (docxData) => {
    ipcRenderer.invoke('loadDocxFile', docxData).then(r => {
      window.postMessage(r, "*");
    })
  }
})
