// db/schema/prompts-schema.ts
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
// 如果你正在使用关系，请导入 relations
import { relations } from "drizzle-orm";
export const prompts = pgTable("prompts", {
id: serial("id").primaryKey(),
// 添加 user_id 列
// Clerk 的用户 ID 是字符串，并且每个 prompt 都必须属于一个用户
user_id: text("user_id").notNull(),
name: text("name").notNull(),
description: text("description").notNull(),
content: text("content").notNull(),
created_at: timestamp("created_at").defaultNow().notNull(),
updated_at: timestamp("updated_at")
.defaultNow()
.notNull()
.$onUpdate(() => new Date()),
});
export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;