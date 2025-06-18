import dayjs from "dayjs";
import editForm from "../form.vue";
import passwordForm from "../passwordForm.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getEmployeeList,
  addEmployeeApi,
  getEmployeeDetailApi,
  updateEmployeeApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    username: ""
  });
  const currentPage = ref(1);
  const currentSize = ref(10);
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
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
      label: "员工姓名",
      prop: "username"
    },
    {
      label: "眼镜编号",
      prop: "cameraDeviceNumber"
    },
    {
      label: "所属门店",
      prop: "scope"
    },
    {
      label: "手机",
      prop: "mobile"
    },
    {
      label: "邮箱",
      prop: "email"
    },
    {
      label: "创建时间",
      prop: "createdAt",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

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
    const { data } = await getEmployeeList({
      ...toRaw(form),
      page: currentPage.value,
      size: currentSize.value,
      kind: 101
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
  function openDialogOne(row?: any) {
    console.log("openDialog==>", row);
    const params = new FormData();
    params.append("id", row?.id);
    getEmployeeDetailApi(params).then(res => {
      if (res && res.data) {
        const { data } = res;
        addDialog({
          title: `临时密码`,
          props: {
            formInline: {
              username: data ? data?.username : "",
              email: data ? data?.email : "",
              shopId: data ? data?.shops[0]?.id : "",
              mobile: data ? data?.mobile : ""
            }
          },
          width: "40%",
          draggable: true,
          fullscreen: deviceDetection(),
          fullscreenIcon: true,
          closeOnClickModal: false,
          contentRenderer: () =>
            h(passwordForm, { ref: formRef, formInline: null }),
          beforeSure: (done, { options }) => {
            // const FormRef = formRef.value.getRef();
            // const curData = options.props.formInline;
            console.log(options);
            function chores() {
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
            chores();
          }
        });
      }
    });
  }
  function openDialog(title = "新增", row?: any) {
    console.log("openDialog==>", row);
    function addLast(data) {
      addDialog({
        title: `${title}员工`,
        props: {
          formInline: {
            username: data ? data?.username : "",
            email: data ? data?.email : "",
            shopId: data ? data?.shops[0]?.id : "",
            mobile: data ? data?.mobile : ""
          }
        },
        width: "40%",
        draggable: true,
        fullscreen: deviceDetection(),
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline;
          function chores() {
            message(`您${title}了员工名称为${curData.username}的这条数据`, {
              type: "success"
            });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
          FormRef.validate(valid => {
            if (valid) {
              console.log("curData", curData);
              // 表单规则校验通过
              if (title === "新增") {
                // 实际开发先调用新增接口，再进行下面操作
                addEmployeeApi({
                  scope: 102,
                  username: curData.username,
                  email: curData.email,
                  enabled: true,
                  password: curData.password,
                  shopIds: [curData.shopId],
                  mobile: curData.mobile,
                  kind: 101
                }).then(res_1 => {
                  if (res_1) {
                    chores();
                  }
                });
              } else {
                // 实际开发先调用修改接口，再进行下面操作
                updateEmployeeApi({
                  id: data?.id,
                  scope: 102,
                  username: curData.username,
                  email: curData.email,
                  enabled: true,
                  mobile: curData.mobile,
                  password: curData.password,
                  shopIds: [curData.shopId],
                  kind: 101
                }).then(res_2 => {
                  if (res_2) {
                    chores();
                  }
                });
              }
            }
          });
        }
      });
    }
    if (row) {
      const params = new FormData();
      params.append("id", row?.id);
      getEmployeeDetailApi(params).then(res => {
        if (res && res.data) {
          const { data } = res;
          addLast(data);
        }
      });
    } else {
      addLast(null);
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { id, name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(id, treeRef.value.getCheckedKeys());
    message(`角色名称为${name}的菜单权限修改成功`, {
      type: "success"
    });
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
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    openDialogOne,
    handleSave,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
