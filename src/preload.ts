// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  getVersion: () => ipcRenderer.invoke("getVersionMain"),
  // we can also expose variables, not just functions
});
