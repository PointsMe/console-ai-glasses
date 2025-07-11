import dayjs from "dayjs";
import editForm from "../form.vue";
import resetPasswordForm from "../resetPasswordForm.vue";
import resetMobileForm from "../reseMobildeForm.vue";
import resetEmailForm from "../resetEmailForm.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getEmployeeList,
  addEmployeeApi,
  getEmployeeDetailApi,
  updateEmployeeApi,
  resetPasswordApi,
  resetMobileApi,
  resetEmailApi,
  deleteEmployeeApi,
  openDisabledApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";
import { usePublicHooks } from "@/hooks/publicHooks";

export function useRole(treeRef: Ref) {
  const form = reactive({
    username: ""
  });
  const { switchStyle } = usePublicHooks();
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
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "督导姓名",
      prop: "username"
    },
    // {
    //   label: "眼镜编号",
    //   prop: "cameraDeviceNumber"
    // },
    {
      label: "负责门店",
      prop: "shops",
      cellRenderer: ({ row }) => {
        return h("div", row?.shops?.map(item => item.name).join(",") || "~");
      }
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
      label: "状态",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enabled}
          active-value={true}
          inactive-value={false}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      ),
      minWidth: 90
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
      width: 350,
      slot: "operation"
    }
  ];
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        try {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: true
            }
          );
          await openDisabledApi({
            id: row.id,
            enabled: row.enabled
          });
          message(`已${row.enabled ? "启用" : "停用"}${row.username}`, {
            type: "success"
          });
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          onSearch();
        } catch (e) {
          console.log(e);
          row.enabled ? (row.enabled = false) : (row.enabled = true);
        }
      })
      .catch(() => {
        row.enabled ? (row.enabled = false) : (row.enabled = true);
      });
  }
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
  function openDialogOne(row?: any) {
    console.log("openDialogOne==>", row);
    addDialog({
      title: `重置密码`,
      props: {
        formInline: {
          id: row?.id
        }
      },
      width: "25%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(resetPasswordForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        console.log(options);
        function chores() {
          message(`员工名称为${row?.username}的密码重置成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            resetPasswordApi({
              id: row?.id,
              password: curData.password
            }).then(res_2 => {
              if (res_2) {
                chores();
              }
            });
          }
        });
      }
    });
  }
  function openDialog(title = "新增", row?: any) {
    console.log("openDialog==>", row);
    function addLast(data) {
      addDialog({
        title: `${title}督导`,
        props: {
          formInline: {
            username: data ? data?.username : "",
            email: data ? data?.email : "",
            shopIds: data ? data?.shops?.map(item => item.id) : [],
            mobile: data ? data?.mobile : "",
            id: data ? data?.id : ""
          }
        },
        width: "25%",
        draggable: true,
        fullscreen: deviceDetection(),
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline;
          function chores() {
            message(`您${title}了督导名称为${curData.username}的这条数据`, {
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
                  shopIds: curData.shopIds,
                  mobile: `${FormRef.mobile_type.replace("+", "")}-${curData.mobile}`,
                  kind: 102
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
                  enabled: data.enabled,
                  mobile: `${FormRef.mobile_type.replace("+", "")}-${curData.mobile}`,
                  password: curData.password,
                  shopIds: curData.shopIds,
                  kind: 102
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

  function openDialogTwo(row?: any) {
    console.log("openDialogTwo==>", row);
    addDialog({
      title: `修改手机号`,
      props: {
        formInline: {
          id: row?.id
        }
      },
      width: "25%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(resetMobileForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        console.log(options);
        function chores() {
          message(`员工名称为${row?.username}的手机号修改成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            resetMobileApi({
              id: row?.id,
              mobile: `${FormRef.mobile_type.replace("+", "")}-${curData.mobile}`
            }).then(res_2 => {
              if (res_2) {
                chores();
              }
            });
          }
        });
      }
    });
  }

  function openDialogThree(row?: any) {
    console.log("openDialogThree==>", row);
    addDialog({
      title: `修改邮箱`,
      props: {
        formInline: {
          id: row?.id
        }
      },
      width: "25%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(resetEmailForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        console.log(options);
        function chores() {
          message(`员工名称为${row?.username}的邮箱修改成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            resetEmailApi({
              id: row?.id,
              email: curData.email
            }).then(res_2 => {
              if (res_2) {
                chores();
              }
            });
          }
        });
      }
    });
  }
  const deleteEmployee = (row: any) => {
    console.log(row);
    ElMessageBox.confirm(
      `确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>${row.username}</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        deleteEmployeeApi({ id: row.id }).then(res => {
          if (res) {
            message(`已删除${row.username}`, {
              type: "success"
            });
            onSearch(); // 刷新表格数据
          }
        });
      })
      .catch(() => {
        console.log("取消");
      });
  };
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
    openDialogTwo,
    openDialogThree,
    deleteEmployee,
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
