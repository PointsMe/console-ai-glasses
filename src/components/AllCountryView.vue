<template>
  <div>
    <el-select
      v-model="value"
      filterable
      placeholder="+86"
      style="width: 80px"
      @change="changeCountry"
    >
      <el-option
        v-for="item in options"
        :key="item.num"
        :label="item.num"
        :value="item.num"
      >
        <div class="all-country">
          <img :src="item.icon" alt="" />
          <span style="margin-left: 10px">{{ item.name }}</span>
          <span>({{ item.num }})</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import countryJson from "@/utils/json";
import { onMounted, watch } from "vue";
defineOptions({
  name: "allCountryView"
});
import { ref } from "vue";
const emits = defineEmits(["changeCountry"]);
const value = ref("+86");
const options = ref<
  Array<{
    icon: string;
    name: string;
    num: string;
    code: string;
  }>
>([]);
const changeCountry = (e: string) => {
  console.log(e);
  emits("changeCountry", e);
};
const getData = async () => {
  const arr: Array<{
    icon: string;
    name: string;
    code: string;
    num: string;
  }> = countryJson.map(item => {
    return {
      icon: item.flags.png,
      name: item.name.common,
      code: item.cca2,
      num: `${item.idd.root}${item.idd.suffixes.toString().replace(/,/g, "")}`
    };
  });
  value.value = "+86";
  changeCountry("+86");
  console.log(value.value);
  options.value = arr;
  console.log(arr);
};
onMounted(() => {
  getData();
});
</script>
<style scoped lang="scss">
.all-country {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: left;
  img {
    width: 15px;
    height: 15px;
  }

  > span {
    display: inline-block;
  }

  > span:first-child {
    display: inline-block;
  }
}
</style>
