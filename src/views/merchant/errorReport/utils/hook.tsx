import dayjs from "dayjs";
import editForm from "../form.vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getDisputeListApi, getDisputeDetailApi } from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    shopId: "",
    loginTime: ""
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
    {
      label: "商家",
      prop: "shop",
      cellRenderer: ({ row }) => {
        return h("div", row?.shop?.name);
      }
    },
    {
      label: "地址信息",
      prop: "shopId",
      cellRenderer: ({ row }) => {
        return h("div", row?.shop?.address);
      }
    },
    {
      label: "申报时间",
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "员工编号",
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
    {
      label: "状态",
      prop: "state"
    },
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
    const { data } = await getDisputeListApi({
      ...toRaw(form),
      page: currentPage.value,
      size: currentSize.value,
      kind: 102
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
    getDisputeDetailApi().then(res => {
      const { data } = res;
      addDialog({
        title: ``,
        props: {
          formInline: {
            id: data?.id ?? "",
            startAt: dayjs(data?.startAt).format("YYYY-MM-DD HH:mm:ss") ?? "",
            endAt: dayjs(data?.endAt).format("YYYY-MM-DD HH:mm:ss") ?? "",
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
        contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
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
