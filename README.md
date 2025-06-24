<h1>vue-pure-admin精简版（国际化版本）</h1>

[![license](https://img.shields.io/github/license/pure-admin/vue-pure-admin.svg)](LICENSE)

**中文** | [English](./README.en-US.md)

## 介绍

精简版是基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提炼出的架子，包含主体功能，更适合实际项目开发，打包后的大小在全局引入 [element-plus](https://element-plus.org) 的情况下仍然低于 `2.3MB`，并且会永久同步完整版的代码。开启 `brotli` 压缩和 `cdn` 替换本地库模式后，打包大小低于 `350kb`

## 版本选择

当前是国际化版本，如果您需要非国际化版本 [请点击](https://github.com/pure-admin/pure-admin-thin)

## 配套视频

[点我查看 UI 设计](https://www.bilibili.com/video/BV17g411T7rq)  
[点我查看快速开发教程](https://www.bilibili.com/video/BV1kg411v7QT)

## 配套保姆级文档

[点我查看 vue-pure-admin 文档](https://pure-admin.cn/)  
[点我查看 @pure-admin/utils 文档](https://pure-admin-utils.netlify.app)

## 高级服务

[点我查看详情](https://pure-admin.cn/pages/service/)

## 预览

[查看预览](https://pure-admin-thin.netlify.app/#/login)

## 项目功能

### 时间工具函数

项目提供了完整的时间工具函数库，位于 `src/utils/time.ts`，包含以下功能：

#### 主要函数

1. **getStandardTimeWithTimezone(date?)**
   - 功能：获取带当前时区的标准时间
   - 参数：date (可选) - Date对象，默认为当前时间
   - 返回值：带时区信息的标准时间字符串
   - 示例：`2024/01/15 14:30:25 中国标准时间`

2. **getCurrentTimezone()**
   - 功能：获取当前时区信息
   - 返回值：包含时区名称、偏移字符串和偏移分钟数的对象
   - 示例：`{ name: "Asia/Shanghai", offset: "+08:00", offsetMinutes: -480 }`

3. **formatTime(date?, format?)**
   - 功能：格式化时间为指定格式
   - 参数：
     - date (可选) - Date对象，默认为当前时间
     - format (可选) - 格式字符串，默认为 'YYYY-MM-DD HH:mm:ss TZ'
   - 支持的格式占位符：YYYY, MM, DD, HH, mm, ss, SSS, TZ

4. **getTimeDifference(date1, date2?)**
   - 功能：获取两个日期之间的时间差
   - 参数：
     - date1 - 第一个日期
     - date2 (可选) - 第二个日期，默认为当前时间
   - 返回值：包含总毫秒数、天数、小时数、分钟数、秒数和格式化字符串的对象

#### 使用示例

```typescript
// 导入时间工具函数
import { 
  getStandardTimeWithTimezone, 
  getCurrentTimeFormats,
  formatTime 
} from '@/utils/time'

// 获取带时区的标准时间
const standardTime = getStandardTimeWithTimezone()
console.log(standardTime) // 例如：2024/01/15 14:30:25 中国标准时间

// 获取当前时间的多种格式
const timeFormats = getCurrentTimeFormats()
console.log(timeFormats.standard) // 标准格式
console.log(timeFormats.iso) // ISO格式
console.log(timeFormats.timezone) // 时区信息

// 自定义格式化时间
const formattedTime = formatTime(new Date(), 'YYYY年MM月DD日 HH:mm:ss TZ')
console.log(formattedTime) // 例如：2024年01月15日 14:30:25 Asia/Shanghai +08:00
```

#### 组件示例

项目包含了一个完整的时间显示组件 `src/components/TimeDisplay.vue`，展示了如何使用时间工具函数：

- 实时显示当前时间（带时区）
- 多种时间格式展示
- 时区信息显示
- 时间格式化示例
- 时间差计算功能

#### 示例页面

访问 `src/views/welcome/TimeExample.vue` 查看完整的时间工具函数使用示例和文档。

## 维护者

[xiaoxian521](https://github.com/xiaoxian521)

## ⚠️ 注意

精简版不接受任何 `issues` 和 `pr`，如果有问题请到完整版 [issues](https://github.com/pure-admin/vue-pure-admin/issues/new/choose) 去提，谢谢！

## 许可证

[MIT © 2020-present, pure-admin](./LICENSE)
