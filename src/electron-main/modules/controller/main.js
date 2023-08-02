const {
  ipcMain,
  BrowserWindow,
  Notification,
  desktopCapturer,
  screen,
  shell,
  webContents,
} = require("electron");

const Store = require("electron-store");

const store = new Store();

// 监听主窗口发送通知事件
const openNotification = () => {
  ipcMain.handle("on-openNotification-event", (event, message) => {
    const NOTIFICATION_TITLE = "您有一条新消息";
    const NOTIFICATION_BODY = message;
    new Notification({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      silent: true,
      icon: "../../tray/icon.ico",
    }).show();
  });
};

// 设置token
const setStore = () => {
  ipcMain.on("set-store", (_, key, value) => {
    store.set(key, value);
  });
};

// 获取token
const getStore = () => {
  ipcMain.handle("get-store", (_, key) => {
    let value = store.get(key);
    return value || "";
  });
};

const InitController = (app) => {
  openNotification();
  setStore();
  getStore();
};

module.exports = {
  InitController,
};
