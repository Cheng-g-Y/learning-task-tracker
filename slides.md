# 学习任务追踪器

MIS 205 Final Project Part 2  
尹成果 · 12310923 · Class 01

---

# 解决什么问题？

- 学生同时面对多门课程和多个截止日期
- 任务散落在聊天、笔记和记忆中
- 学习任务追踪器将任务按课程集中管理

---

# 数据库设计

- `auth.users`：Supabase Auth 用户
- `categories`：课程分类
- `tasks`：学习任务
- Row Level Security：每位用户只能访问自己的数据

关系：`auth.users 1:N categories`、`auth.users 1:N tasks`、`categories 1:N tasks`

---

# 现场演示

1. 注册并登录
2. 创建课程分类
3. 添加任务
4. 查看并筛选任务
5. 编辑、标记完成并删除任务

---

# AI 协作反思

- AI 帮助快速搭建 Supabase 前端和 SQL
- 我检查了认证流程、RLS 策略和 CRUD 测试
- 关键经验：AI 生成代码后仍需验证权限边界
