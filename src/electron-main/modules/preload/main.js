const { contextBridge, ipcRenderer } = require("electron");

const openNotification = async (message) => {
  let result = await ipcRenderer.invoke("on-openNotification-event", message);
};

const setStore = (key, value) => {
  ipcRenderer.send("set-store", key, value);
};

const getStore = async (key) => {
  const value = await ipcRenderer.invoke("get-store", key);
  return value;
};

contextBridge.exposeInMainWorld("electronAPI", {
  openNotification,
  setStore,
  getStore,
});
