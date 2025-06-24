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
    text: "各项违规次数"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {},
  grid: {
    right: "1%",
    bottom: "3%",
    containLabel: true
  },
  dataZoom: [
    {
      type: "inside"
    },
    {
      type: "slider"
    }
  ],
  xAxis: {
    type: "category",
    axisLabel: {
      rotate: 45
    },
    data: ["Brazil", "Indonesia", "USA", "India", "China", "World"]
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, 0.01]
  },
  // dataZoom: [
  //   {
  //     show: true,
  //     start: 94,
  //     end: 100
  //   },
  //   {
  //     type: "inside",
  //     start: 94,
  //     end: 100
  //   },
  //   {
  //     show: true,
  //     yAxisIndex: 0,
  //     filterMode: "empty",
  //     width: 30,
  //     height: "80%",
  //     showDataShadow: false,
  //     left: "93%"
  //   }
  // ],
  series: [
    {
      name: "2011",
      type: "bar",
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: "2012",
      type: "bar",
      data: [19325, 23438, 31000, 121594, 134141, 681807]
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
  setOptions(options.value as any);
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
      console.log("newVal.summary.former==>", newVal.summary);
      options.value.xAxis.data = newVal.summary.map((iv: any) => iv.name);
      // options.value.legend.data = [
      //   category.join("~"),
      //   categoryLatter.join("~")
      // ];
      const arr = newVal.summary.map((iv: any) => {
        return iv.compare.former;
      });
      const arr1 = newVal.summary.map((iv: any) => {
        return iv.compare.latter;
      });
      options.value.series[0].name = category.join("~");
      options.value.series[1].name = categoryLatter.join("~");
      options.value.series[0].data = arr;
      options.value.series[1].data = arr1;
      console.log("options.value==>", JSON.stringify(options.value));
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
