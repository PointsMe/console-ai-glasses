import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  shopIds: [{ required: true, message: "此项为必填项", trigger: "change" }],
  email: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  mobile: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  password: [{ required: true, message: "此项为必填项", trigger: "blur" }]
});
