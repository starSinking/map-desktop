import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: "./", // 打包路径
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  build: {
    target: "es2015",
    outDir: "dist", // 输出路径
    assetsDir: "static/", // 生成静态资源的存放路径
    cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  server: {
    host: "0.0.0.0", //指定服务器应该监听哪个 IP 地址
    port: 3000, // 服务端口号
    cors: true, // 允许跨域
    base: "./ ", //生产环境路径
    strictPort: false, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
    open: true, // 服务器启动时自动在浏览器中打开应用程序 此值为字符串时，会被用作 URL 的路径名
    fs: {
      strict: false,
    },
  },
});
