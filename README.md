# 学习任务追踪器

MIS 205 Final Project Part 2。前端使用 HTML、CSS 和原生 JavaScript，后端使用 Supabase Auth 与托管 PostgreSQL。

## Setup

1. 在 Supabase 创建 Singapore 区域项目。
2. 打开 Supabase SQL Editor，运行 [`schema.sql`](schema.sql)。
3. 在 Project Settings > API 中复制 Project URL 和 publishable key。
4. 将两个值填入 [`js/supabase.js`](js/supabase.js)。publishable key 可以放在浏览器前端，`service_role` key 不可以。
5. 使用本地静态服务器启动项目：

   ```bash
   python3 -m http.server 8000
   ```

6. 浏览器访问 `http://localhost:8000`。

## Demo Checklist

- 注册、登录和退出。
- 未登录访问 `dashboard.html` 时自动返回登录页。
- 创建课程分类。
- 添加、读取、编辑、标记完成和删除任务。
- 使用第二个账号验证无法查看第一个账号的数据。

## GitHub Bonus Workflow

建议创建三个功能分支并分别合并 Pull Request：

1. `feat/auth`：Supabase 登录、注册和保护页面。
2. `feat/task-crud`：任务增删改查。
3. `feat/categories-ui`：课程分类、筛选和样式。
