# 更新日志

## [2026-05-25] v1.2.0

### 修复
- 修复 FullCalendar 组件加载失败问题（cdn.jsdelivr.net → unpkg.com）
- 修复 PV/UV 统计功能不显示问题

### 新增
- 日历视图默认显示月视图
- 侧边栏响应式展开（大屏幕 >1024px 默认展开）
- 侧边栏按钮添加悬停提示
- 日历事件悬停显示倒计时和状态（进行中/即将开始）
- PV/UV 统计历史记录图表（近7天访问趋势）
- 本周访问量统计

### 优化
- 事件过滤添加缓存机制
- 侧边栏切换添加防抖优化
- upcomingContests 日期计算性能优化
- 日历事件 tooltip 样式美化
- 历史数据保留时间延长至90天

### 修改的文件
- calendar-modern.html - 日历现代视图页面
- calendar.html - 日历页面
- index.html - 首页
- index.css - 首页样式
- main.js - 公共脚本和统计功能
