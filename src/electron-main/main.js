const { InitController } = require("./modules/controller/main.js");
const { app, BrowserWindow, crashReporter } = require("electron");
const path = require("path");
const { createMainWindow } = require("./windows/mainWindows.js");
const { initTray } = require("./tray/index.js");
const { initShortCut, unInstallShortCut } = require("./shortcut/index");

// 获取奔溃堆栈文件存放路径
let crashFilePath = "";
let crashDumpsDir = "";
try {
  // electron 低版本
  crashFilePath = path.join(app.getPath("temp"), app.getName() + " Crashes");
  console.log("————————crash path:", crashFilePath);

  // electron 高版本
  crashDumpsDir = app.getPath("crashDumps");
  console.log("————————crashDumpsDir:", crashDumpsDir);
} catch (e) {
  console.error("获取奔溃文件路径失败", e);
}

// 开启crash捕获
crashReporter.start({
  productName: "desktop",
  companyName: "desktop",
  submitURL: "https://www.xxx.com", // 上传到服务器的地址
  uploadToServer: false, // 不上传服务器
  ignoreSystemCrashHandler: false, // 不忽略系统自带的奔溃处理，为 true 时表示忽略，奔溃时不会生成奔溃堆栈文件
});

app.whenReady().then(() => {
  createMainWindow(BrowserWindow);
  // createLoadWindow(BrowserWindow);
  app.on("activate", () => {
    //即使没有打开任何窗口，macOS 应用通常也会继续运行， 在mac上如果没有任何活动的窗口，就创建一个
    if (BrowserWindow.getAllWindows().length === 0)
      createLoginWindow(BrowserWindow);
  });
  // 初始化监听事件
  InitController(app);
  // 初始化托盘
  initTray();
  // 初始化快捷键
  initShortCut();
  app.setAppUserModelId("工具");
});
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
// 客户端聚焦
app.on("browser-window-focus", () => {
  // 初始化快捷键
  initShortCut();
  console.log("browser-window-focus");
});
// 客户端失去焦点
app.on("browser-window-blur", () => {
  // 注销快捷键
  // unInstallShortCut();
  console.log("browser-window-blur");
});
app.on("will-quit", () => {
  // 注销快捷键
  unInstallShortCut();
});
