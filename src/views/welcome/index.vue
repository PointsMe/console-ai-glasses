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
  formerStartAt: dayjs().subtract(1, "month").startOf("month").toDate(),
  formerEndAt: dayjs().subtract(1, "month").endOf("month").toDate(),
  latterStartAt: dayjs().subtract(0, "month").startOf("month").toDate(),
  latterEndAt: dayjs().subtract(0, "month").endOf("month").toDate()
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
  if (!form.value.shopId) {
    ElMessage.error("请选择门店");
    return;
  }
  getMerchantLoginLogFn();
};
const getMerchantDetailFn = async () => {
  const { data } = await getMerchantDetail();
  console.log("getMerchantDetailFn==>", data);
  data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
  dataValue.value = data;
  return data;
};
const getShopList = async () => {
  const { data } = await selectorShop();
  form.value.shopId = data[0].id;
  shopList.value = data;
  return data;
};
const getMerchantLoginLogFn = async () => {
  const { data } = await getViolationCompare({
    shopId: form.value.shopId,
    formerStartAt: convertISOToTimezoneFormat(form.value.formerStartAt),
    formerEndAt: convertISOToTimezoneFormat(form.value.formerEndAt),
    latterStartAt: convertISOToTimezoneFormat(form.value.latterStartAt),
    latterEndAt: convertISOToTimezoneFormat(form.value.latterEndAt)
  });
  if (data) {
    compareDataOne.value = {
      summary: data.summary,
      formerAt: [form.value.formerStartAt, form.value.formerEndAt],
      latterAt: [form.value.latterStartAt, form.value.latterEndAt]
    };
    compareDataTwo.value = {
      summary: data.kinds,
      formerAt: [form.value.formerStartAt, form.value.formerEndAt],
      latterAt: [form.value.latterStartAt, form.value.latterEndAt]
    };
    compareDataThree.value = {
      summary: data.employees,
      formerAt: [form.value.formerStartAt, form.value.formerEndAt],
      latterAt: [form.value.latterStartAt, form.value.latterEndAt]
    };
  }
  console.log("getMerchantLoginLogFn==>", data);
};
onMounted(() => {
  Promise.all([getMerchantDetailFn(), getShopList()]).then(res => {
    console.log("res==>", res);
    if (res[1] && res[1].length > 0) {
      getMerchantLoginLogFn();
    }
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
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="text-left text-lg font-bold mb-4">违规数据对比</div>
        </el-col>
        <el-col :span="24">
          <div>
            <el-form
              ref="formRef"
              :inline="true"
              :model="form"
              label-width="80px"
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
              <el-form-item
                label=""
                prop="formerStartAt"
                style="margin-right: -50px"
              >
                <el-date-picker
                  v-model="form.formerStartAt"
                  type="datetime"
                  :disabled-date="
                    date =>
                      form.formerEndAt
                        ? date.getTime() > new Date(form.formerEndAt).getTime()
                        : false
                  "
                  placeholder="请选择开始时间"
                />
              </el-form-item>
              <el-form-item
                label="~"
                prop="formerEndAt"
                style="margin-right: -30px"
              >
                <el-date-picker
                  v-model="form.formerEndAt"
                  type="datetime"
                  :disabled-date="
                    date =>
                      form.formerStartAt
                        ? date.getTime() <
                          new Date(form.formerStartAt).getTime()
                        : false
                  "
                  placeholder="请选择结束时间"
                />
              </el-form-item>
              <el-form-item
                label="对比"
                prop="latterStartAt"
                style="margin-right: -50px"
              >
                <el-date-picker
                  v-model="form.latterStartAt"
                  type="datetime"
                  :disabled-date="
                    date =>
                      form.latterEndAt
                        ? date.getTime() > new Date(form.latterEndAt).getTime()
                        : false
                  "
                  placeholder="请选择开始时间"
                />
              </el-form-item>
              <el-form-item label="~" prop="latterEndAt">
                <el-date-picker
                  v-model="form.latterEndAt"
                  type="datetime"
                  :disabled-date="
                    date =>
                      form.latterStartAt
                        ? date.getTime() <
                          new Date(form.latterStartAt).getTime()
                        : false
                  "
                  placeholder="请选择结束时间"
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
