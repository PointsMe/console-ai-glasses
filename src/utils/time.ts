/**
 * 时间工具函数
 * 提供各种时间格式化和获取功能
 */

/**
 * 获取带当前时区的标准时间
 * @param date 可选，默认为当前时间
 * @returns 带时区信息的标准时间字符串
 */
export function getStandardTimeWithTimezone(date: Date = new Date()): string {
  return date.toLocaleString("zh-CN", {
    timeZoneName: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

/**
 * 获取带时区的ISO格式时间
 * @param date 可选，默认为当前时间
 * @returns ISO格式的时间字符串
 */
export function getISOStringWithTimezone(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * 获取当前时区信息
 * @returns 时区信息对象
 */
export function getCurrentTimezone(): {
  name: string;
  offset: string;
  offsetMinutes: number;
} {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const offsetMinutes = Math.abs(timezoneOffset % 60);
  const offsetSign = timezoneOffset <= 0 ? "+" : "-";
  const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

  // 尝试获取时区名称
  let timezoneName = "Unknown";
  try {
    timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("无法获取时区名称:", error);
  }

  return {
    name: timezoneName,
    offset: offsetString,
    offsetMinutes: timezoneOffset
  };
}

/**
 * 格式化时间为指定格式
 * @param date 日期对象
 * @param format 格式字符串，支持以下占位符：
 *   - YYYY: 4位年份
 *   - MM: 2位月份
 *   - DD: 2位日期
 *   - HH: 2位小时（24小时制）
 *   - mm: 2位分钟
 *   - ss: 2位秒数
 *   - SSS: 3位毫秒
 *   - TZ: 时区信息
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  date: Date = new Date(),
  format: string = "YYYY-MM-DD HH:mm:ss TZ"
): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  const timezone = getCurrentTimezone();

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds)
    .replace("SSS", milliseconds)
    .replace("TZ", `${timezone.name} ${timezone.offset}`);
}

/**
 * 获取当前时间的多种格式
 * @returns 包含多种时间格式的对象
 */
export function getCurrentTimeFormats() {
  const now = new Date();
  const timezone = getCurrentTimezone();

  return {
    // 标准格式（带时区）
    standard: getStandardTimeWithTimezone(now),
    // ISO格式
    iso: getISOStringWithTimezone(now),
    // 自定义格式
    formatted: formatTime(now),
    // 时区信息
    timezone: timezone,
    // 时间戳
    timestamp: now.getTime(),
    // 本地时间字符串
    localString: now.toLocaleString(),
    // UTC时间字符串
    utcString: now.toUTCString()
  };
}

/**
 * 将时间戳转换为带时区的标准时间
 * @param timestamp 时间戳（毫秒）
 * @returns 带时区信息的标准时间字符串
 */
export function timestampToStandardTime(timestamp: number): string {
  return getStandardTimeWithTimezone(new Date(timestamp));
}

/**
 * 检查是否为有效日期
 * @param date 日期对象或日期字符串
 * @returns 是否为有效日期
 */
export function isValidDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * 获取两个日期之间的时间差
 * @param date1 第一个日期
 * @param date2 第二个日期，默认为当前时间
 * @returns 时间差对象
 */
export function getTimeDifference(date1: Date, date2: Date = new Date()) {
  const diff = Math.abs(date2.getTime() - date1.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    total: diff,
    days,
    hours,
    minutes,
    seconds,
    formatted: `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`
  };
}

/**
 * 将ISO 8601格式的时间字符串从带毫秒的格式转换为带时区偏移的格式
 * @param isoString ISO 8601格式的时间字符串，如 "2025-05-01T00:00:00.000Z"
 * @returns 带时区偏移的格式，如 "2025-05-01T00:00:00+0000"
 */
export function convertISOToTimezoneFormat(isoString: string): string {
  try {
    const date = new Date(isoString);

    if (!isValidDate(date)) {
      throw new Error("无效的日期字符串");
    }

    // 获取UTC时间的各个部分
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    // 构建带时区偏移的格式（UTC时间，偏移为+0000）
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+0000`;
  } catch (error) {
    console.error("时间格式转换失败:", error);
    throw new Error(
      `时间格式转换失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * 将带时区偏移的格式转换为ISO 8601格式
 * @param timezoneString 带时区偏移的格式，如 "2025-05-01T00:00:00+0000"
 * @returns ISO 8601格式的时间字符串，如 "2025-05-01T00:00:00.000Z"
 */
export function convertTimezoneToISOFormat(timezoneString: string): string {
  try {
    const date = new Date(timezoneString);

    if (!isValidDate(date)) {
      throw new Error("无效的日期字符串");
    }

    return date.toISOString();
  } catch (error) {
    console.error("时间格式转换失败:", error);
    throw new Error(
      `时间格式转换失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * 时间格式转换工具类
 * 提供各种时间格式之间的转换功能
 */
export class TimeFormatConverter {
  /**
   * 将ISO 8601格式转换为带时区偏移的格式
   * @param isoString ISO 8601格式的时间字符串
   * @returns 带时区偏移的格式
   */
  static isoToTimezone(isoString: string): string {
    return convertISOToTimezoneFormat(isoString);
  }

  /**
   * 将带时区偏移的格式转换为ISO 8601格式
   * @param timezoneString 带时区偏移的格式
   * @returns ISO 8601格式的时间字符串
   */
  static timezoneToISO(timezoneString: string): string {
    return convertTimezoneToISOFormat(timezoneString);
  }

  /**
   * 批量转换时间格式
   * @param timeStrings 时间字符串数组
   * @param fromFormat 源格式类型 ('iso' | 'timezone')
   * @param toFormat 目标格式类型 ('iso' | 'timezone')
   * @returns 转换后的时间字符串数组
   */
  static batchConvert(
    timeStrings: string[],
    fromFormat: "iso" | "timezone",
    toFormat: "iso" | "timezone"
  ): string[] {
    return timeStrings.map(timeString => {
      if (fromFormat === "iso" && toFormat === "timezone") {
        return this.isoToTimezone(timeString);
      } else if (fromFormat === "timezone" && toFormat === "iso") {
        return this.timezoneToISO(timeString);
      } else {
        return timeString; // 相同格式，直接返回
      }
    });
  }
}
/**
 * 将标准时间转换为 yyyy-mm-dd 格式的字符串
 * @param date 日期对象或时间字符串，默认为当前时间
 * @returns yyyy-mm-dd 格式的字符串
 */
export function formatToDateString(date: Date | string = new Date()): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    throw new Error("无效的日期格式");
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * 批量转换时间数组为 yyyy-mm-dd 格式
 * @param dates 日期对象或时间字符串数组
 * @returns yyyy-mm-dd 格式的字符串数组
 */
export function batchFormatToDateString(dates: (Date | string)[]): string[] {
  return dates.map(date => formatToDateString(date));
}
