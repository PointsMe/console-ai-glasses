import dayjs from "dayjs";
import videoDialog from "@/components/videoDialog.vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import {
  disputeReviewApi,
  getDisputeDetailApi,
  getViolationDetailApi
} from "@/api/user";
import { h, ref } from "vue";
import { ElMessage } from "element-plus";

export function useOpenDialog() {
  const formRef = ref();
  function openDialog(row?: any, type?: string) {
    const params = new FormData();
    params.append("id", row?.id);
    let res = null;
    let btns = [];
    if (type === "violationReport") {
      res = getViolationDetailApi;
      btns = [
        {
          label: "确认",
          size: "default",
          type: "primary",
          btnClick: ({ dialog: { options, index }, button }) => {
            console.log(options, index, button);
            closeDialog(options, index);
          }
        }
      ];
    } else if (type === "declarationReport" || type === "errorReport") {
      res = getDisputeDetailApi;
      btns = [
        {
          label: "审核不通过",
          size: "default",
          type: "danger",
          btnClick: ({ dialog: { options, index }, button }) => {
            console.log(options, index, button);
            disputeReviewApi({
              id: row?.id,
              state: 104
            }).then((res: any) => {
              if (res.code === 20000) {
                ElMessage.success("审核不通过");
                closeDialog(options, index);
              }
            });
          }
        },
        {
          label: "审核通过",
          size: "default",
          type: "success",
          btnClick: ({ dialog: { options, index }, button }) => {
            console.log(options, index, button);
            disputeReviewApi({
              id: row?.id,
              state: 103
            }).then((res: any) => {
              if (res.code === 20000) {
                ElMessage.success("审核通过");
                closeDialog(options, index);
              }
            });
          }
        }
      ];
    }
    console.log(res);
    if (res) {
      res(params).then(res => {
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
          contentRenderer: () =>
            h(videoDialog, { ref: formRef, formInline: null }),
          footerButtons: btns
        });
      });
    }
  }
  return {
    openDialog,
    transformI18n
  };
}
