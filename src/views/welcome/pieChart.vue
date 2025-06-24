<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";
import { batchFormatToDateString } from "@/utils/time";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
const options = ref({
  title: {
    text: "总违规次数"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "bar",
      showBackground: true,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
});
const { isDark } = useDark();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const pieChartRef = ref();
const { setOptions } = useECharts(pieChartRef, {
  theme
});
onMounted(() => {
  console.log("props.data==>", props.data);
});
watch(
  () => props.data,
  (newVal, oldVal) => {
    console.log("newVal==>", newVal);
    console.log("oldVal==>", oldVal);
    if (newVal && newVal.formerAt && newVal.latterAt) {
      const category = batchFormatToDateString(newVal.formerAt);
      const categoryLatter = batchFormatToDateString(newVal.latterAt);
      console.log("category==>", category);
      console.log("categoryLatter==>", categoryLatter);
      options.value.xAxis.data = [category.join("~"), categoryLatter.join("~")];
      options.value.series[0].data = [
        newVal.summary.former,
        newVal.summary.latter
      ];
      setOptions(options.value as any);
    }
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div ref="pieChartRef" style="width: 100%; height: 35vh" />
</template>
