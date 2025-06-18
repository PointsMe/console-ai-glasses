const Layout = () => import("@/layout/index.vue");

export default {
  path: "/equipment",
  name: "EquipmentIndex",
  component: Layout,
  redirect: "/equipment/index",
  meta: {
    icon: "ep/setting",
    title: "设备",
    rank: 5
  },
  children: [
    {
      path: "/equipment/index",
      name: "Equipment",
      component: () => import("@/views/equipment/index.vue"),
      meta: {
        title: "设备",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
