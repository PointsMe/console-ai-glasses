import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  shopIds: [{ required: true, message: "此项为必填项", trigger: "change" }],
  email: [
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱",
      trigger: "blur"
    }
  ],
  mobile: [
    {
      required: true,
      type: "number",
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ],
  password: [
    { required: true, min: 6, message: "密码长度不能小于6位", trigger: "blur" }
  ]
});
