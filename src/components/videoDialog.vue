<script setup lang="ts">
import { ref } from "vue";
import VideoPage from "@/components/video.vue";
interface FormProps {
  formInline: any;
}
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    startAt: "",
    endAt: "",
    fileUrl: "",
    title: "",
    content: "",
    shopName: "",
    shopCode: "",
    logoUrl: ""
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <div class="content-vio">
    <el-row>
      <el-col :span="6">
        <div class="left-col">
          <h3>视频时间：</h3>
          <p>
            {{ newFormInline.startAt }}
          </p>
          <p>-</p>
          <p>
            {{ newFormInline.endAt }}
          </p>
          <h3 class="h3-top">{{ newFormInline.shopName }}</h3>
          <p>{{ newFormInline.shopCode }}</p>
          <h3 class="h3-top">{{ newFormInline.title }}</h3>
          <p>{{ newFormInline.content }}</p>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right-col">
          <VideoPage
            :form-inline="{
              fileUrl: newFormInline.fileUrl,
              logoUrl: newFormInline.logoUrl
            }"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.content-vio {
  .el-col {
    display: flex;
    flex-direction: column;
  }
  .left-col,
  .right-col {
    width: 100%;
    // min-height: 650px;
    padding-bottom: 20px;
    .h3-top {
      margin-top: 20px;
    }
  }
}
</style>
