<script setup lang="ts">
import dayjs from "dayjs";
import {
  getMerchantDetail,
  MerchantDetailResult,
  selectorShop,
  getViolationCompare
} from "@/api/user";
import PieChart from "./pieChart.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import listOne from "./listOne.vue";
import listOneTwo from "./listOneTwo.vue";
import listOneThree from "./listOneThree.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { convertISOToTimezoneFormat } from "@/utils/time";
defineOptions({
  name: "User"
});
import Refresh from "~icons/ep/refresh";
import PieChartTwo from "./pieChartTwo.vue";
import PieChartThree from "./pieChartThree.vue";
const formRef = ref();
const router = useRouter();
const form = ref({
  shopId: "",
  startTimeArray: [
    dayjs().subtract(1, "month").startOf("month").toDate(),
    dayjs().subtract(1, "month").endOf("month").toDate()
  ],
  endTimeArray: [
    dayjs().subtract(0, "month").startOf("month").toDate(),
    dayjs().subtract(0, "month").endOf("month").toDate()
  ]
});
const loading = ref(false);
const shopList = ref([]);
const compareDataOne = ref();
const compareDataTwo = ref();
const compareDataThree = ref();
const dataValue = ref<MerchantDetailResult>();
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};
const onSearch = () => {
  console.log("onSearch", form.value);
  getMerchantLoginLogFn();
};
const getMerchantDetailFn = async () => {
  const { data } = await getMerchantDetail();
  console.log("getMerchantDetailFn==>", data);
  data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
  dataValue.value = data;
};
const getShopList = async () => {
  const { data } = await selectorShop();
  form.value.shopId = data[0].id;
  shopList.value = data;
};
const getMerchantLoginLogFn = async () => {
  const { data } = await getViolationCompare({
    shopId: form.value.shopId,
    formerStartAt: convertISOToTimezoneFormat(
      form.value.startTimeArray[0].toISOString()
    ),
    formerEndAt: convertISOToTimezoneFormat(
      form.value.startTimeArray[1].toISOString()
    ),
    latterStartAt: convertISOToTimezoneFormat(
      form.value.endTimeArray[0].toISOString()
    ),
    latterEndAt: convertISOToTimezoneFormat(
      form.value.endTimeArray[1].toISOString()
    )
  });
  if (data) {
    compareDataOne.value = {
      summary: data.summary,
      formerAt: form.value.startTimeArray,
      latterAt: form.value.endTimeArray
    };
    compareDataTwo.value = {
      summary: data.kinds,
      formerAt: form.value.startTimeArray,
      latterAt: form.value.endTimeArray
    };
    compareDataThree.value = {
      summary: data.employees,
      formerAt: form.value.startTimeArray,
      latterAt: form.value.endTimeArray
    };
  }
  console.log("getMerchantLoginLogFn==>", data);
};
onMounted(() => {
  Promise.all([getMerchantDetailFn(), getShopList()]).then(res => {
    console.log("res==>", form.value);
    getMerchantLoginLogFn();
  });
});
</script>

<template>
  <div class="main">
    <div class="bg-bg_color">
      <el-row class="top-row">
        <el-col :span="6">
          <div>商家信息</div>
        </el-col>
        <el-col :span="6">
          <div>公司地址</div>
        </el-col>
        <el-col :span="6">
          <div>创建时间</div>
        </el-col>
        <el-col :span="6">
          <div>操作</div>
        </el-col>
      </el-row>
      <el-row class="bottom-row">
        <el-col :span="6">
          <div class="flex items-center">
            <img
              :src="dataValue?.logoUrl"
              alt=""
              class="w-[100px] h-[100px] mr-4"
            />
            <div class="flex flex-col">
              <span>{{ dataValue?.name }}</span>
              <span class="mt-8">{{ dataValue?.code }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span>
              {{ dataValue?.company?.country?.name }}-{{
                dataValue?.company?.province?.name
              }}-{{ dataValue?.company?.city }}</span
            ><br />
            <span>{{ dataValue?.company?.address }}</span
            ><br />
            <span>{{ dataValue?.company?.contactPhone }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>{{ dataValue?.createdAt }}</div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-button
              type="primary"
              class="mr-4"
              size="small"
              @click="router.push({ name: 'Store' })"
              >门店</el-button
            >
            <el-button
              type="primary"
              class="mr-4"
              size="small"
              @click="router.push({ name: 'Merchant' })"
              >督导</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bg-bg_color margin-top-12">
      <el-row>
        <el-col :span="24">
          <div class="text-left text-lg font-bold mb-4">违规数据对比</div>
        </el-col>
        <el-col :span="24">
          <div>
            <el-form
              ref="formRef"
              :inline="true"
              :model="form"
              label-width="40px"
              class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
            >
              <el-form-item label="" prop="shopId">
                <el-select
                  v-model="form.shopId"
                  class="w-[380px]!"
                  placeholder="请选择门店"
                >
                  <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-date-picker
                  v-model="form.startTimeArray"
                  style="width: 100%"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="default"
                />
              </el-form-item>
              <el-form-item label="对比">
                <el-date-picker
                  v-model="form.endTimeArray"
                  style="margin-left: 10px"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="default"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :icon="useRenderIcon('ri/search-line')"
                  :loading="loading"
                  @click="onSearch"
                >
                  搜索
                </el-button>
                <!-- <el-button
                  :icon="useRenderIcon(Refresh)"
                  @click="resetForm(formRef)"
                >
                  重置
                </el-button> -->
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <PieChart class="echart mt-[10px]" :data="compareDataOne" />
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <PieChartTwo class="echart mt-[10px]" :data="compareDataTwo" />
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <PieChartThree class="echart mt-[10px]" :data="compareDataThree" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bg-bg_color margin-top-12">
      <listOne />
    </div>
    <div class="bg-bg_color margin-top-12">
      <listOneTwo />
    </div>
    <div class="bg-bg_color margin-top-12">
      <listOneThree />
    </div>
  </div>
</template>
<style scoped lang="scss">
.main {
  padding: 8px;
  .margin-top-12 {
    margin-top: 12px;
  }
  .bg-bg_color {
    background-color: #fff;
    padding: 12px;
    border-radius: 3px;
    .top-row {
      margin-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 12px;
    }
    .bottom-row {
      padding-top: 12px;
    }
  }
}
</style>
