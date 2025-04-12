# Sakura Words - 日语词汇学习应用

## 项目介绍
Sakura Words 是一个基于 Vue 3 开发的日语词汇学习应用，采用游戏化的学习方式，帮助用户更有趣、更高效地学习日语单词。项目借鉴了 Duolingo 的学习理念，通过精心设计的课程体系和交互体验，让日语学习变得轻松愉快。

## 功能特性
- 🎯 课程系统：提供系统化的日语词汇学习课程
- 📊 学习统计：实时跟踪学习进度和成果
- 🎮 游戏化学习：通过互动练习提高学习兴趣
- 💫 精美界面：现代化的UI设计，优秀的用户体验
- 📱 响应式设计：支持多种设备访问

## 技术栈
- Vue 3：使用最新的 Composition API
- Vite：下一代前端构建工具
- Vue Router：Vue.js 官方路由
- TypeScript：提供类型支持
- CSS Variables：灵活的主题定制

## 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- pnpm 包管理器

### 安装步骤
1. 克隆项目
```bash
git clone [项目地址]
cd Sakura-Words
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 项目结构
```
Sakura-Words/
├── src/                # 源代码目录
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── data/         # 课程数据
│   ├── router/       # 路由配置
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── public/           # 公共资源
└── index.html        # HTML 模板
```

## 主题定制
项目使用 CSS 变量进行主题定制，主要颜色变量：
```css
--primary-color: #58cc02    # 主要颜色
--secondary-color: #1cb0f6  # 次要颜色
--text-color: #3c3c3c       # 文本颜色
```

## 贡献指南
欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证
本项目基于 MIT 许可证开源。
