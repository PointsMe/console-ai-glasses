import dayjs from "dayjs";
import editForm from "./form.vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { getViolationDetailApi } from "@/api/user";
import { h, ref } from "vue";

export function useOpenDialog() {
  const formRef = ref();
  function openDialog(row?: any) {
    const params = new FormData();
    params.append("id", row?.id);
    getViolationDetailApi(params).then(res => {
      const { data } = res;
      addDialog({
        title: ``,
        props: {
          formInline: {
            id: data?.id ?? "",
            startAt: dayjs(data?.startAt).format("YYYY-MM-DD HH:mm:ss") ?? "",
            endAt: dayjs(data?.endAt).format("YYYY-MM-DD HH:mm:ss") ?? "",
            fileUrl: data?.fileUrl ?? "",
            title: data?.title ?? "",
            content: data?.content ?? "",
            shopName: data?.shop?.name ?? "",
            shopCode: data?.shop?.code ?? "",
            logoUrl: data?.shop?.logoUrl ?? ""
          }
        },
        width: "45%",
        draggable: true,
        fullscreen: deviceDetection(),
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
        beforeSure: (done, { options }) => {
          console.log(options);
          function chores() {
            done(); // 关闭弹框
            // onSearch(); // 刷新表格数据
          }
          chores();
        }
      });
    });
  }
  return {
    openDialog,
    transformI18n
  };
}
