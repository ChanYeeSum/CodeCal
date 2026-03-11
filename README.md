# CodeCal - 编程竞赛日历

一个现代化的编程竞赛日历网页应用，帮助竞赛爱好者追踪各大平台的比赛信息。

> 更新：新增邮件提醒系统，可通过 GitHub Actions 实现每日比赛信息推送。

## 特色功能

### 现代化界面
- 新粗野主义设计风格
- 支持明暗主题切换
- 响应式布局适配各种设备
- 流畅的动画和交互效果

### 多视图展示
- **首页**：项目介绍和快速导航
- **列表视图**：简洁清晰的比赛概览
- **日历视图**：直观的时间安排，支持周/日/月视图切换
- 平台快速筛选功能

### 便捷操作
- 一键复制比赛信息
- 快速访问比赛详情
- 智能时区适配
- 多平台信息聚合

### 邮件提醒
- 24小时比赛预告
- 精美的 HTML 邮件模板
- 支持多收件人配置
- GitHub Actions 自动化发送

## 支持平台

| 平台 | 说明 | 官网 |
|------|------|------|
| Codeforces | 全球最大的竞赛平台 | [codeforces.com](https://codeforces.com) |
| AtCoder | 日本顶级竞赛平台 | [atcoder.jp](https://atcoder.jp) |
| LeetCode | 算法题库和竞赛平台 | [leetcode.com](https://leetcode.com) |
| 牛客 | 综合竞赛和面试平台 | [nowcoder.com](https://www.nowcoder.com) |
| 洛谷 | 知名算法竞赛平台 | [luogu.com.cn](https://www.luogu.com.cn) |

## 快速开始

### 在线访问

访问官网：[https://ChanYeeSum.github.io/CodeCal/](https://ChanYeeSum.github.io/CodeCal/)

### 本地部署

1. 克隆仓库：
   ```bash
   git clone https://github.com/ChanYeeSum/CodeCal.git
   cd CodeCal
   ```

2. 启动本地服务器：
   ```bash
   python -m http.server 8080
   ```

3. 访问网页：打开浏览器访问 `http://localhost:8080`

### 配置邮件提醒

1. 准备配置文件：
   ```bash
   cp mailer/config.example.json mailer/config.json
   ```

2. 编辑 `config.json`，填入 SMTP 服务器信息

3. 配置 GitHub Actions Secrets：
   - `SMTP_HOST`：SMTP 服务器地址（如 smtp.gmail.com）
   - `SMTP_PORT`：端口（如 587）
   - `SMTP_USERNAME`：用户名
   - `SMTP_PASSWORD`：密码或应用密码
   - `SMTP_FROM`：发件人邮箱
   - `TO_ADDRESSES`：收件人列表（逗号分隔）

## 技术栈

### 前端
- **Vue 3**：响应式数据处理
- **FullCalendar**：日历视图实现
- **CSS Variables**：主题切换
- **Local Storage**：用户偏好存储

### 后端
- **Python**：数据爬取
- **SMTP**：邮件发送
- **GitHub Actions**：自动化部署

### 自动化流程
- 每 15 分钟自动更新比赛数据
- 智能缓存机制确保离线可用
- 失败自动重试（最多 3 次）
- 每日定时发送邮件提醒

## 项目结构

```
CodeCal/
├── intro.html              # 介绍页面
├── index.html              # 列表视图
├── calendar-modern.html    # 日历视图
├── index.css               # 列表样式
├── calendar-modern.css     # 日历样式
├── platform-tag.css        # 平台标签样式
├── contests.json           # 比赛数据
├── contest_fetcher.py      # 数据爬取脚本
├── mailer/                 # 邮件模块
│   ├── send_contest_email.py
│   ├── templates.py
│   └── utils.py
├── icons/                  # 平台图标
└── .github/workflows/      # GitHub Actions
```

## 自定义开发

### 修改前端界面
编辑 `index.html`、`calendar-modern.html` 及相关 CSS 文件

### 调整邮件模板
在 `mailer/templates.py` 中修改 HTML 模板

### 添加新平台
在 `contests.json` 中添加数据，更新平台标签样式

## 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交改动：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 安全说明

- 所有密钥通过 GitHub Secrets 管理
- 邮件使用 SSL/TLS 加密传输
- 配置文件已加入 .gitignore

## 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 版权信息

© [ChanYeeSum](https://github.com/ChanYeeSum). All rights reserved.

[GitHub 仓库](https://github.com/ChanYeeSum/CodeCal) | [作者主页](https://github.com/ChanYeeSum)