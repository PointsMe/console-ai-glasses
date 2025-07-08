import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getDisputeListApi,
  getDisputeDetailApi,
  disputeReviewApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h } from "vue";
import videoDialog from "@/components/videoDialog.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { convertISOToTimezoneFormat } from "@/utils/time";
export function useRole(treeRef: Ref) {
  const router = useRouter();
  const form = reactive({
    shopId: router.currentRoute.value.query.shopId,
    startTime: "",
    endTime: ""
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
      label: "审核状态",
      prop: "supervisorState",
      cellRenderer: ({ row, props }) => (
        <el-tag
          type={[
            { 101: "info", 103: "success", 104: "danger" }[row.supervisorState]
          ]}
          size={props.size}
        >
          {[
            { 101: "未审核", 103: "审核通过", 104: "审核不通过" }[
              row.supervisorState
            ]
          ]}
        </el-tag>
      )
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
      shopId: form.shopId,
      startTime: form.startTime
        ? convertISOToTimezoneFormat(form.startTime)
        : "",
      endTime: form.endTime ? convertISOToTimezoneFormat(form.endTime) : "",
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
    getDisputeDetailApi(params).then(res => {
      const { data } = res;
      addDialog({
        title: `视频详情`,
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
        contentRenderer: () =>
          h(videoDialog, { ref: formRef, formInline: null }),
        footerButtons:
          data.supervisorState === 101
            ? [
                {
                  label: "审核不通过",
                  size: "default",
                  type: "danger",
                  btnClick: ({ dialog: { options, index }, button }) => {
                    console.log(options, index, button);
                    disputeReviewApi({
                      id: row?.id,
                      state: 104
                    }).then((res: any) => {
                      if (res.code === 20000) {
                        ElMessage.success("审核不通过");
                        closeDialog(options, index);
                        onSearch();
                      }
                    });
                  }
                },
                {
                  label: "审核通过",
                  size: "default",
                  type: "success",
                  btnClick: ({ dialog: { options, index }, button }) => {
                    console.log(options, index, button);
                    disputeReviewApi({
                      id: row?.id,
                      state: 103
                    }).then((res: any) => {
                      if (res.code === 20000) {
                        ElMessage.success("审核通过");
                        closeDialog(options, index);
                        onSearch();
                      }
                    });
                  }
                }
              ]
            : [
                {
                  label: "确认",
                  size: "default",
                  type: "primary",
                  btnClick: ({ dialog: { options, index }, button }) => {
                    console.log(options, index, button);
                    closeDialog(options, index);
                  }
                }
              ]
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
