<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { selectorShop } from "@/api/user";
import AllCountryView from "@/components/AllCountryView.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    shopIds: "",
    username: "",
    password: "",
    mobile: "",
    email: ""
  })
});
const mobile_type = ref("+86");
const shopList = ref([]);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return {
    ...ruleFormRef.value,
    mobile_type: mobile_type.value
  };
}
const changeCountry = (e: string) => {
  console.log(e);
  mobile_type.value = e;
};
const getCountryList = async () => {
  const res = await selectorShop({});
  if (res) {
    shopList.value = res.data;
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
        <el-form-item label="门店" prop="shopIds">
          <el-select
            v-model="newFormInline.shopIds"
            placeholder="请选择门店名称"
            clearable
          >
            <el-option
              v-for="item in shopList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入姓名"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="!newFormInline.id" :span="24">
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="newFormInline.mobile"
            clearable
            placeholder="请输入手机"
          >
            <template #prepend>
              <AllCountryView @changeCountry="changeCountry" />
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col v-if="!newFormInline.id" :span="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="!newFormInline.id" :span="24">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入密码"
            type="password"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
