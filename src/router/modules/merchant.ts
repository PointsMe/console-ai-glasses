const Layout = () => import("@/layout/index.vue");

export default {
  path: "/merchant",
  name: "MerchantIndex",
  component: Layout,
  redirect: "/merchant/index",
  meta: {
    icon: "ep/collection",
    title: "商家",
    rank: 2
  },
  children: [
    {
      path: "/merchant/index",
      name: "Merchant",
      component: () => import("@/views/merchant/supervision/index.vue"),
      meta: {
        title: "商家",
        showLink: true
      }
    },
    {
      path: "/merchant/errorReport",
      name: "ErrorReport",
      component: () => import("@/views/merchant/errorReport/index.vue"),
      meta: {
        title: "报错记录",
        showLink: false
      }
    },
    {
      path: "/merchant/declarationReport",
      name: "DeclarationReport",
      component: () => import("@/views/merchant/declarationReport/index.vue"),
      meta: {
        title: "申报记录",
        showLink: false
      }
    },
    {
      path: "/merchant/violationReport",
      name: "ViolationReport",
      component: () => import("@/views/merchant/violationReport/index.vue"),
      meta: {
        title: "违规记录",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
