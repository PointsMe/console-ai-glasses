import dayjs from "dayjs";
import videoDialog from "@/components/videoDialog.vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getviolationListApi, getViolationDetailApi } from "@/api/user";
import { type Ref, reactive, ref, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { convertISOToTimezoneFormat } from "@/utils/time";
export function useRole(treeRef: Ref) {
  const router = useRouter();
  const form = reactive({
    shopId: router.currentRoute.value.query.shopId,
    startTime: "",
    endTime: "",
    kind: ""
  });
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const currentPage = ref(1);
  const currentSize = ref(10);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    // {
    //   label: "角色编号",
    //   prop: "id"
    // },
    {
      label: "门店",
      prop: "shop",
      cellRenderer: ({ row }) => {
        return h("div", row?.shop?.name);
      }
    },
    // {
    //   label: "地址信息",
    //   prop: "shopId",
    //   cellRenderer: ({ row }) => {
    //     return h("div", row.shop.address);
    //   }
    // },
    {
      label: "报错时间",
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "员工姓名",
      prop: "employee",
      cellRenderer: ({ row }) => {
        return h("div", row.employee.name);
      }
    },
    {
      label: "违规标题",
      prop: "title"
    },
    {
      label: "违规动作描述",
      prop: "content"
    },
    {
      label: "时间区间",
      prop: "startAt",
      formatter: ({ startAt, endAt }) => {
        return h(
          "div",
          `${dayjs(startAt).format("YYYY-MM-DD HH:mm:ss")} - ${dayjs(
            endAt
          ).format("YYYY-MM-DD HH:mm:ss")}`
        );
      }
    },
    // {
    //   label: "状态",
    //   prop: "state",
    //   cellRenderer: ({ row }) => {
    //     return h(
    //       "span",
    //       {
    //         class: {
    //           101: "text-grey-500",
    //           103: "text-red-500",
    //           104: "text-green-500"
    //         }[row.state]
    //       },
    //       { 101: "未审核", 103: "违规", 104: "正常" }[row.state]
    //     );
    //   }
    // },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "h-[20px]!",
  //     "reset-margin",
  //     "text-gray-500!",
  //     "dark:text-white!",
  //     "dark:hover:text-primary!"
  //   ];
  // });
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    currentSize.value = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    currentPage.value = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getviolationListApi({
      shopId: form.shopId,
      startAt: form.startTime ? convertISOToTimezoneFormat(form.startTime) : "",
      endAt: form.endTime ? convertISOToTimezoneFormat(form.endTime) : "",
      page: currentPage.value,
      size: currentSize.value,
      kind: form.kind
    });
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(row?: any) {
    const params = new FormData();
    params.append("id", row?.id);
    getViolationDetailApi(params).then(res => {
      const { data } = res;
      addDialog({
        title: `视频详情`,
        props: {
          formInline: {
            id: data?.id ?? "",
            startAt: data?.violation?.startAt
              ? dayjs(data?.violation?.startAt).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endAt: data?.violation?.endAt
              ? dayjs(data?.violation?.endAt).format("YYYY-MM-DD HH:mm:ss")
              : "",
            fileUrl: data?.fileUrl ?? "",
            title: data?.title ?? "",
            content: data?.content ?? "",
            shopName: data?.shop?.name ?? "",
            shopCode: data?.shop?.code ?? "",
            logoUrl: data?.shop?.logoUrl ?? ""
          }
        },
        width: "45%",
        draggable: true,
        fullscreen: deviceDetection(),
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () =>
          h(videoDialog, { ref: formRef, formInline: null }),
        beforeSure: (done, { options }) => {
          console.log(options);
          function chores() {
            done(); // 关闭弹框
            // onSearch(); // 刷新表格数据
          }
          chores();
        }
      });
    });
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
