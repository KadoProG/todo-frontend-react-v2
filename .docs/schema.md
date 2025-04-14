# 📦 テーブル一覧

## ユーザ　`users`

| カラム名          | 型           | 属性               |
| ----------------- | ------------ | ------------------ |
| id                | BIGINT       | PK, AUTO_INCREMENT |
| name              | VARCHAR      | NOT NULL           |
| email             | VARCHAR      | UNIQUE, NOT NULL   |
| email_verified_at | TIMESTAMP    | NULLABLE           |
| password          | VARCHAR      | NOT NULL           |
| remember_token    | VARCHAR(100) | NULLABLE           |
| created_at        | TIMESTAMP    |                    |
| updated_at        | TIMESTAMP    |                    |
| deleted_at        | TIMESTAMP    | Soft delete対応    |

## タスク `tasks`

| カラム名        | 型        | 属性                              |
| --------------- | --------- | --------------------------------- |
| id              | BIGINT    | PK, AUTO_INCREMENT                |
| title           | VARCHAR   | NOT NULL                          |
| description     | TEXT      | NULLABLE                          |
| is_public       | BOOLEAN   | NOT NULL                          |
| is_done         | BOOLEAN   | NOT NULL                          |
| expired_at      | DATETIME  | NULLABLE                          |
| created_user_id | BIGINT    | FK → users(id), ON DELETE CASCADE |
| created_at      | TIMESTAMP |                                   |
| updated_at      | TIMESTAMP |                                   |
| deleted_at      | TIMESTAMP | Soft delete対応                   |

## タスクの担当者中間テーブル `task_assigned_users`

| カラム名                                      | 型        | 属性                              |
| --------------------------------------------- | --------- | --------------------------------- |
| id                                            | BIGINT    | PK, AUTO_INCREMENT                |
| task_id                                       | BIGINT    | FK → tasks(id), ON DELETE CASCADE |
| user_id                                       | BIGINT    | FK → users(id), ON DELETE CASCADE |
| created_at                                    | TIMESTAMP |                                   |
| updated_at                                    | TIMESTAMP |                                   |
| UNIQUE(task_id, user_id) — 重複割り当てを防止 |

## タスクアクション `task_actions`

| カラム名   | 型        | 属性                              |
| ---------- | --------- | --------------------------------- |
| id         | BIGINT    | PK, AUTO_INCREMENT                |
| task_id    | BIGINT    | FK → tasks(id), ON DELETE CASCADE |
| name       | VARCHAR   | NOT NULL                          |
| is_done    | BOOLEAN   | NOT NULL                          |
| created_at | TIMESTAMP |                                   |
| updated_at | TIMESTAMP |                                   |
| deleted_at | TIMESTAMP | Soft delete対応                   |

## ER図

```mermaid
erDiagram

users {
	number id
  string name
  string email
  datetime email_verified_at
  string password
  string remember_token
	datetime created_at
  datetime updated_at
  datetime deleted_at
}

tasks {
	number id
	string title
	text description
	boolean is_public
	boolean is_done
	datetime expired_at
	number created_user_id
	datetime created_at
	datetime updated_at
	datetime deleted_at
}

task_assigned_users {
	nubmer id
	number task_id
	number user_id
	datetime created_at
	datetime updated_at
}

task_actions {
	number id
	number task_id
	string name
	boolean is_done
  datetime created_at
	datetime updated_at
	datetime deleted_at
}

users ||--o{ tasks : "1ユーザは複数タスクを持つ"
tasks ||--o{ task_actions : "1タスクは複数タスクアクションを持つ"
users ||--o{ task_assigned_users : "担当者中間テーブル"
tasks ||--o{ task_assigned_users : "担当者中間テーブル"
```
