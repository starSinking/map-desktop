import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import router from "@/render/router/index";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
