<script setup lang="ts">
import { getMerchantDetail } from "@/api/user";
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import {
  getCountryListApi,
  getCityListApi,
  getProvinceListApi
} from "@/api/user";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    name: "",
    countryId: "",
    provinceId: "",
    city: "",
    address: "",
    contactName: "",
    contactPhone: ""
  })
});
const countryList = ref([]);
const provinceList = ref([]);
const cityList = ref([]);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}
const getCountryList = async () => {
  const res = await getCountryListApi();
  if (res) {
    countryList.value = res.data;
  }
};
const changeCountry = (e: string) => {
  cityList.value = [];
  getProvinceList(e);
};
const changeProvince = (e: string) => {
  getCityList(e);
};
const getProvinceList = async (id: string) => {
  const params = new FormData();
  params.append("countryId", id);
  const res = await getProvinceListApi(params);
  if (res) {
    provinceList.value = res.data;
  }
};
const getCityList = async (id: string) => {
  const params = new FormData();
  params.append("provinceId", id);
  const res = await getCityListApi(params);
  if (res) {
    cityList.value = res.data;
  }
};

onMounted(() => {
  getCountryList();
});
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入编号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="国家" prop="countryId">
          <el-select
            v-model="newFormInline.countryId"
            placeholder="请选择国家"
            clearable
            @change="changeCountry"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="省份" prop="provinceId">
          <el-select
            v-model="newFormInline.provinceId"
            placeholder="请选择省份"
            clearable
            @change="changeProvince"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="城市" prop="city">
          <el-select
            v-model="newFormInline.city"
            placeholder="请选择城市"
            clearable
          >
            <el-option
              v-for="item in cityList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="newFormInline.address"
            placeholder="请输入地址"
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="联系人" prop="contactName">
          <el-input
            v-model="newFormInline.contactName"
            clearable
            placeholder="请输入联系人"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="电话" prop="contactPhone">
          <el-input
            v-model="newFormInline.contactPhone"
            clearable
            placeholder="请输入电话"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
