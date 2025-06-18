<script setup lang="ts">
import dayjs from "dayjs";
import { getMerchantDetail, MerchantDetailResult } from "@/api/user";
import pieChart from "./pieChart.vue";
import { ref, onMounted } from "vue";
defineOptions({
  name: "User"
});
const value = ref("");
const options = [
  {
    value: "1",
    label: "Option 1"
  }
];
const dataValue = ref<MerchantDetailResult>();
const getMerchantDetailFn = async () => {
  const { data } = await getMerchantDetail();
  console.log("getMerchantDetailFn==>", data);
  data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
  dataValue.value = data;
};
onMounted(() => {
  getMerchantDetailFn();
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
            <el-button type="primary" class="mr-4" size="small">门店</el-button>
            <el-button type="primary" class="mr-4" size="small">督导</el-button>
            <el-button type="primary" class="mr-4" size="small"
              >账号管理</el-button
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
            <span>门店名称：</span>
            <el-select
              v-model="value"
              placeholder="Select"
              size="default"
              style="width: 240px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <pieChart class="echart mt-[10px]" />
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <pieChart class="echart mt-[10px]" />
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <pieChart class="echart mt-[10px]" />
          </div>
        </el-col>
      </el-row>
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
