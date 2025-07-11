import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getShopList,
  addShop,
  getShopDetailApi,
  getMerchantDetail,
  updateShop
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";
import { PictureFilled } from "@element-plus/icons-vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    name: ""
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
    {
      label: "门店logo",
      prop: "logoUrl",
      cellRenderer: ({ row }) => {
        return row.logoUrl ? (
          <img
            src={row.logoUrl}
            alt="logo"
            style="width: 100px; height: 100px;"
          />
        ) : (
          <el-icon class="text-2xl">
            <PictureFilled />
          </el-icon>
        );
      }
    },
    {
      label: "门店",
      prop: "name"
      // cellRenderer: ({ row }) => {
      //   return row.logoUrl ? (
      //     <div class="text-center">
      //       <img
      //         src={row.logoUrl}
      //         alt="logo"
      //         style="width: 100px; height: 100px;"
      //       />
      //       <span class="text-sm font-medium">{row.name}</span>
      //     </div>
      //   ) : (
      //     <div class="flex items-center justify-center gap-2">
      //       <span class="w-20 h-20" />
      //       <span class="text-sm font-medium">{row.name}</span>
      //     </div>
      //   );
      // }
    },
    {
      label: "报错次数",
      prop: "errorCount",
      slot: "errorCount"
    },
    {
      label: "申报次数",
      prop: "disputeCount",
      slot: "disputeCount"
    },
    {
      label: "违规次数",
      prop: "violationCount",
      slot: "violationCount"
    },
    {
      label: "地址信息",
      prop: "address",
      cellRenderer: ({ row }) => (
        <div>
          <div>
            <span>{row.address.country?.name}</span>-
            <span>{row.address.province?.name}</span>-
            <span>{row.address.city}</span>
          </div>
          <div>
            <span>{row.address.address}</span>
          </div>
        </div>
      )
    },
    {
      label: "创建时间",
      prop: "createTime",
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
    const { data } = await getShopList({
      ...toRaw(form),
      page: currentPage.value,
      size: currentSize.value
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
  async function openDialog(title = "新增", row?: any) {
    let res = null;
    if (row) {
      const params = new FormData();
      params.append("id", row?.id);
      res = await getShopDetailApi(params);
    } else {
      res = await getMerchantDetail();
    }
    console.log("res==>", res);
    const { data } = res;
    addDialog({
      title: `${title}门店`,
      props: {
        formInline: {
          name: row ? data?.name : "",
          code: row ? data?.code : "",
          countryId: row ? data?.address?.country?.id : "",
          provinceId: row ? data?.address?.province?.id : "",
          city: row ? data?.address?.city : "",
          address: row ? data?.address?.address : "",
          contactName: row ? data?.address?.contactName : "",
          contactPhone: row ? data?.address?.contactPhone : "",
          zipcode: row ? data?.address?.zipcode : "",
          logoUrl: row ? data?.logoUrl : "",
          remark: row ? data?.description : ""
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
          message(`您${title}了门店名称为${curData.name}的这条数据`, {
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
              addShop({
                logoUrl: curData.logoUrl,
                code: curData.code,
                name: curData.name,
                company: {
                  ...data?.company,
                  countryId: data?.company?.country?.id,
                  provinceId: data?.company?.province?.id
                },
                address: {
                  ...curData
                },
                description: curData.remark
              }).then(() => {
                chores();
              });
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              updateShop({
                id: data?.id,
                logoUrl: curData.logoUrl,
                code: curData.code,
                name: curData.name,
                company: {
                  ...data?.company,
                  countryId: data?.company?.country?.id,
                  provinceId: data?.company?.province?.id
                },
                address: {
                  ...curData
                },
                description: curData.remark
              }).then(() => {
                chores();
              });
            }
          }
        });
      }
    });
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
