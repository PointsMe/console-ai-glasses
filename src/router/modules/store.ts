const Layout = () => import("@/layout/index.vue");

export default {
  path: "/store",
  name: "StoreIndex",
  component: Layout,
  redirect: "/store/index",
  meta: {
    icon: "ep/credit-card",
    title: "门店",
    rank: 3
  },
  children: [
    {
      path: "/store/index",
      name: "Store",
      component: () => import("@/views/store/storeList/index.vue"),
      meta: {
        title: "门店",
        showLink: true
      }
    }
    // {
    //   path: "/store/utensils",
    //   name: "Utensils",
    //   component: () => import("@/views/store/cookingUtensils/index.vue"),
    //   meta: {
    //     title: "炊具",
    //     showLink: true
    //   }
    // }
  ]
} satisfies RouteConfigsTable;
