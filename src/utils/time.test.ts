/**
 * 时间工具函数测试文件
 * 用于验证时间工具函数的正确性
 */

import {
  getStandardTimeWithTimezone,
  getCurrentTimezone,
  formatTime,
  getCurrentTimeFormats,
  timestampToStandardTime,
  isValidDate,
  getTimeDifference,
  convertISOToTimezoneFormat,
  convertTimezoneToISOFormat,
  TimeFormatConverter
} from "./time";

// 测试函数
export function testTimeUtils() {
  console.log("=== 时间工具函数测试 ===");

  // 测试获取标准时间
  console.log("\n1. 测试 getStandardTimeWithTimezone:");
  const standardTime = getStandardTimeWithTimezone();
  console.log("标准时间:", standardTime);
  console.log("类型:", typeof standardTime);
  console.log(
    "是否包含时区信息:",
    standardTime.includes("标准时间") || standardTime.includes("GMT")
  );

  // 测试获取时区信息
  console.log("\n2. 测试 getCurrentTimezone:");
  const timezone = getCurrentTimezone();
  console.log("时区信息:", timezone);
  console.log("时区名称:", timezone.name);
  console.log("时区偏移:", timezone.offset);
  console.log("偏移分钟数:", timezone.offsetMinutes);

  // 测试格式化时间
  console.log("\n3. 测试 formatTime:");
  const testDate = new Date("2024-01-15 14:30:25");
  const formatted1 = formatTime(testDate, "YYYY-MM-DD HH:mm:ss");
  const formatted2 = formatTime(testDate, "YYYY年MM月DD日 HH:mm:ss TZ");
  console.log("默认格式:", formatTime(testDate));
  console.log("自定义格式1:", formatted1);
  console.log("自定义格式2:", formatted2);

  // 测试获取多种时间格式
  console.log("\n4. 测试 getCurrentTimeFormats:");
  const timeFormats = getCurrentTimeFormats();
  console.log("所有时间格式:", timeFormats);
  console.log("标准格式:", timeFormats.standard);
  console.log("ISO格式:", timeFormats.iso);
  console.log("时间戳:", timeFormats.timestamp);

  // 测试时间戳转换
  console.log("\n5. 测试 timestampToStandardTime:");
  const timestamp = Date.now();
  const timestampTime = timestampToStandardTime(timestamp);
  console.log("时间戳:", timestamp);
  console.log("转换后的时间:", timestampTime);

  // 测试日期有效性检查
  console.log("\n6. 测试 isValidDate:");
  const validDate = new Date();
  const invalidDate = new Date("invalid date");
  const validString = "2024-01-15";
  const invalidString = "invalid date string";

  console.log("有效日期对象:", isValidDate(validDate));
  console.log("无效日期对象:", isValidDate(invalidDate));
  console.log("有效日期字符串:", isValidDate(validString));
  console.log("无效日期字符串:", isValidDate(invalidString));

  // 测试时间差计算
  console.log("\n7. 测试 getTimeDifference:");
  const date1 = new Date("2024-01-01 10:00:00");
  const date2 = new Date("2024-01-15 14:30:00");
  const difference = getTimeDifference(date1, date2);
  console.log("日期1:", date1.toLocaleString());
  console.log("日期2:", date2.toLocaleString());
  console.log("时间差:", difference);
  console.log("格式化时间差:", difference.formatted);

  // 测试边界情况
  console.log("\n8. 测试边界情况:");
  const now = new Date();
  const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 明天
  const past = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 昨天

  console.log(
    "当前时间与未来时间差:",
    getTimeDifference(now, future).formatted
  );
  console.log("当前时间与过去时间差:", getTimeDifference(now, past).formatted);

  console.log("\n=== 测试完成 ===");

  return {
    standardTime,
    timezone,
    formatted1,
    formatted2,
    timeFormats,
    timestampTime,
    difference
  };
}

// 性能测试
export function performanceTest() {
  console.log("\n=== 性能测试 ===");

  const iterations = 10000;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    getStandardTimeWithTimezone();
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(
    `执行 ${iterations} 次 getStandardTimeWithTimezone 耗时: ${duration.toFixed(2)}ms`
  );
  console.log(`平均每次耗时: ${(duration / iterations).toFixed(4)}ms`);

  return duration;
}

// 测试时间格式转换功能
console.log("=== 时间格式转换测试 ===");

// 测试用例1：ISO格式转时区格式
const isoTime = "2025-05-01T00:00:00.000Z";
console.log("原始ISO格式:", isoTime);

try {
  const timezoneFormat = convertISOToTimezoneFormat(isoTime);
  console.log("转换为时区格式:", timezoneFormat);
  console.log("✅ 转换成功");
} catch (error) {
  console.error("❌ 转换失败:", error);
}

// 测试用例2：时区格式转ISO格式
const timezoneTime = "2025-05-01T00:00:00+0000";
console.log("\n原始时区格式:", timezoneTime);

try {
  const isoFormat = convertTimezoneToISOFormat(timezoneTime);
  console.log("转换为ISO格式:", isoFormat);
  console.log("✅ 转换成功");
} catch (error) {
  console.error("❌ 转换失败:", error);
}

// 测试用例3：使用工具类
console.log("\n=== 使用TimeFormatConverter工具类 ===");

try {
  const result1 = TimeFormatConverter.isoToTimezone(isoTime);
  console.log("ISO转时区格式:", result1);

  const result2 = TimeFormatConverter.timezoneToISO(timezoneTime);
  console.log("时区转ISO格式:", result2);

  console.log("✅ 工具类测试成功");
} catch (error) {
  console.error("❌ 工具类测试失败:", error);
}

// 测试用例4：批量转换
console.log("\n=== 批量转换测试 ===");

const timeStrings = [
  "2025-05-01T00:00:00.000Z",
  "2025-05-01T12:30:45.123Z",
  "2025-05-01T23:59:59.999Z"
];

try {
  const batchResult = TimeFormatConverter.batchConvert(
    timeStrings,
    "iso",
    "timezone"
  );
  console.log("批量转换结果:");
  batchResult.forEach((result, index) => {
    console.log(`${index + 1}. ${timeStrings[index]} -> ${result}`);
  });
  console.log("✅ 批量转换成功");
} catch (error) {
  console.error("❌ 批量转换失败:", error);
}

// 测试用例5：错误处理
console.log("\n=== 错误处理测试 ===");

try {
  const invalidTime = "invalid-time-string";
  convertISOToTimezoneFormat(invalidTime);
  console.log("❌ 应该抛出错误但没有");
} catch (error) {
  console.log(
    "✅ 错误处理正常:",
    error instanceof Error ? error.message : error
  );
}

console.log("\n=== 测试完成 ===");

// 导出测试结果
export function runAllTests() {
  const results = testTimeUtils();
  const performance = performanceTest();

  return {
    results,
    performance,
    summary: {
      totalTests: 8,
      performanceTest: true,
      timestamp: new Date().toISOString()
    }
  };
}

// 如果直接运行此文件，执行测试
if (typeof window !== "undefined") {
  // 在浏览器环境中，将测试函数挂载到全局对象
  (window as any).testTimeUtils = testTimeUtils;
  (window as any).performanceTest = performanceTest;
  (window as any).runAllTests = runAllTests;

  console.log("时间工具函数测试已加载，可通过以下方式运行测试：");
  console.log("- testTimeUtils() - 运行基本功能测试");
  console.log("- performanceTest() - 运行性能测试");
  console.log("- runAllTests() - 运行所有测试");
}
