const Layout = () => import("@/layout/index.vue");

export default {
  path: "/employee",
  name: "EmployeeIndex",
  component: Layout,
  redirect: "/employee/index",
  meta: {
    icon: "ep/user-filled",
    title: "员工",
    rank: 4
  },
  children: [
    {
      path: "/employee/index",
      name: "Employee",
      component: () => import("@/views/employee/index.vue"),
      meta: {
        title: "员工",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
