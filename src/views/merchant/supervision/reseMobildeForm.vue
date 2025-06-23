<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import AllCountryView from "@/components/AllCountryView.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: ""
  })
});
const mobile_type = ref("+86");
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return {
    ...ruleFormRef.value,
    mobile_type: mobile_type.value
  };
}

defineExpose({ getRef });
const changeCountry = (e: string) => {
  console.log(e);
  mobile_type.value = e;
};
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
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="newFormInline.mobile"
            clearable
            placeholder="请输入手机号"
          >
            <template #prepend>
              <AllCountryView @changeCountry="changeCountry" />
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
