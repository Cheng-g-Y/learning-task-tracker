# MIS 205 Final Project Part 2 Report

## Student Information

- Name: 尹成果
- Student ID: 12310923
- Class: 01
- GitHub Repository: https://github.com/Cheng-g-Y/learning-task-tracker

## Project Overview

学习任务追踪器帮助学生按照课程管理学习任务。用户通过 Supabase Auth 注册和登录，可以创建课程分类，并对任务执行添加、查看、修改和删除操作。Supabase Row Level Security 保证用户只能访问自己的数据。

## Screenshots

提交前插入以下现场截图：

1. 注册页面和注册成功提示
2. 登录页面
3. 新增任务
4. 查看任务列表
5. 编辑任务
6. 删除任务后的任务列表

## ER Diagram

```text
auth.users (1) ----< categories (many)
auth.users (1) ----< tasks      (many)
categories (1) ----< tasks      (many)
```
