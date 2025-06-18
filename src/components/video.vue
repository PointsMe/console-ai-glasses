<script setup lang="ts">
import { onMounted, ref } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import VideoPlay from "~icons/ep/video-play";
interface FormProps {
  formInline: any;
}
import Player from "xgplayer";
import "xgplayer/dist/index.min.css";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    fileUrl: "",
    logoUrl: ""
  })
});
const newFormInline = ref<any>(props.formInline);
defineOptions({
  name: "VideoPage"
});

onMounted(() => {
  console.log("newFormInline==>", newFormInline.value);
  new Player({
    id: "mse",
    lang: "zh",
    // 默认静音
    volume: 0,
    autoplay: false,
    screenShot: true,
    videoAttributes: {
      crossOrigin: "anonymous"
    },
    // url: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4",
    url: newFormInline.value.fileUrl,
    poster: newFormInline.value.logoUrl,
    // poster:
    //   "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg",
    fluid: deviceDetection(),
    //传入倍速可选数组
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
});
</script>

<template>
  <el-card shadow="never">
    <div id="mse" />
  </el-card>
</template>

<style scoped>
#mse {
  flex: auto;
}
</style>
