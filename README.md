# 斗罗大陆模拟器 - Vue前后端分离版

## 项目结构

```
douluo-vue/
├── backend/          # 后端 (Node.js + Express)
│   ├── package.json
│   ├── server.js     # 服务器入口
│   └── gameLogic.js  # 游戏核心逻辑
└── frontend/         # 前端 (Vue3 + Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js
        ├── App.vue
        ├── api.js
        └── components/
            ├── CreateCharacter.vue
            └── GameMain.vue
```

## 快速开始

### 1. 启动后端

```bash
cd backend
npm install
npm start
```

后端运行在 http://localhost:3001

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 3. 访问游戏

打开浏览器访问 http://localhost:5173

## 功能特性

- 角色创建：输入名字和性别，其余属性随机分配
- 隐藏武魂：5%概率觉醒孤竹武魂（高速度低攻击，强制孤儿，改名十年孤竹）
- 双生武魂：随机概率获得双生武魂
- 修炼系统：每天一次，固定+0.2级，50%概率暴击
- 探索系统：在当前地区探索，随机获得奖励或遭遇事件
- 地图导航：前往不同地区，部分地区有等级限制
- 休息系统：回满体力
- 时间系统：推进一月，角色成长
- 三栏布局：左栏属性/魂环/装备，中栏内容/日志，右栏地区/快捷操作

## API接口

- POST /api/create - 创建角色
- GET /api/state/:sessionId - 获取游戏状态
- POST /api/cultivate/:sessionId - 修炼
- POST /api/explore/:sessionId - 探索
- POST /api/rest/:sessionId - 休息
- POST /api/advance-month/:sessionId - 推进一月
- POST /api/navigate/:sessionId - 导航到地区
- POST /api/save/:sessionId - 存档
- POST /api/load/:sessionId - 读档

## 技术栈

- 前端：Vue 3 + Vite + Axios
- 后端：Node.js + Express + CORS
- 数据存储：内存存储（可扩展为文件或数据库）
