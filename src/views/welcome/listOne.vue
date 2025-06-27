<script setup lang="ts">
import dayjs from "dayjs";
import { h, ref, onMounted, toRaw } from "vue";
import { getviolationListApi } from "@/api/user";
import { useRouter } from "vue-router";
import { useOpenDialog } from "./hooks";
const tableData = ref([]);
const { openDialog } = useOpenDialog();
const columns: TableColumnList = [
  {
    label: "门店",
    prop: "shop",
    cellRenderer: ({ row }) => {
      return h("div", row?.shop?.name);
    }
  },
  {
    label: "地址信息",
    prop: "shopId",
    cellRenderer: ({ row }) => {
      return h("div", row.shop.address);
    }
  },
  {
    label: "报错时间",
    prop: "createdAt",
    formatter: ({ createdAt }) => dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
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
    prop: "state",
    cellRenderer: ({ row }) => {
      return h(
        "span",
        {
          class: {
            101: "text-grey-500",
            103: "text-red-500",
            104: "text-green-500"
          }[row.state]
        },
        { 101: "未审核", 103: "违规", 104: "正常" }[row.state]
      );
    }
  },
  {
    label: "操作",
    fixed: "right",
    width: 210,
    slot: "operation"
  }
];
const router = useRouter();
const loading = ref(true);
async function onSearch() {
  loading.value = true;
  const { data } = await getviolationListApi({
    page: 1,
    size: 4
  });
  tableData.value = data.list;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}
const toViolationReport = () => {
  router.push("/merchant/violationReport");
};
const handleVideoPlay = (row: any) => {
  openDialog(row, "violationReport");
};
onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="flex justify-between">
    <div>违规记录(<span style="color: grey">显示近一周</span>)</div>
    <div>
      <el-button type="text" @click="toViolationReport">查看更多</el-button>
    </div>
  </div>
  <pure-table :data="tableData" :columns="columns">
    <template #operation="{ row }">
      <el-button type="text" @click="handleVideoPlay(row)">视频回放</el-button>
    </template>
  </pure-table>
</template>
