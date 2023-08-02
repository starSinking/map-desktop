const { app, Menu, Tray, nativeImage, BrowserWindow } = require("electron");
const { unInstallShortCut } = require("../shortcut/index");
const path = require("path");
let appIcon = null;
const initTray = () => {
  const iconPath = path.join(__dirname, "/icon.ico").replace("/\\/g", "\\\\");
  appIcon = new Tray(nativeImage.createFromPath(iconPath));
  appIcon.setToolTip("工具");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "退出",
      type: "normal",
      click: () => {
        unInstallShortCut();
        app.exit();
      },
    },
  ]);

  // Make a change to the context menu
  // contextMenu.items[1].checked = false;

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu);
  appIcon.on("click", () => {
    global.mainWindow.show();
  });
};

module.exports = {
  initTray,
};
