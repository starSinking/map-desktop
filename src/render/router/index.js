import { createRouter, createWebHashHistory } from "vue-router";

export const constantRouterMap = [
  {
    path: "/",
    name: "Index",
    hidden: true,
    component: () => import("@/render/views/Index/Index.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
  routes: constantRouterMap,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
