// actions/prompts-actions.ts
"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema/prompts-schema";
import { devDelay } from "@/lib/dev-delay";
// 导入 Drizzle 操作符 'and' 和 'eq' (等于)
import { and, desc, eq } from "drizzle-orm";
// 导入我们的 auth 辅助函数
import { requireUserId } from "./auth-actions";

// --- 获取 Prompts ---
export async function getPrompts() {
  try {
    // 获取用户 ID；如果未登录则抛出错误
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: 正在为用户 ${userId} 获取 prompts...`);
    // 添加 WHERE 子句以按 user_id 过滤
    const userPrompts = await db
      .select()
      .from(prompts)
      .where(eq(prompts.user_id, userId)) // 只选择与用户 ID 匹配的 prompts
      .orderBy(desc(prompts.created_at));

    console.log(`Server Action: 已获取 ${userPrompts.length} 个 prompts。`);
    return userPrompts;
  } catch (error) {
    console.error("Server Action 错误 (getPrompts):", error);
    // 传播特定的 "Unauthorized" 错误或一个通用错误
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    throw new Error("获取 prompts 失败。");
  }
}

// --- 创建 Prompt ---
export async function createPrompt({ name, description, content }: { name: string; description: string; content: string }) {
  try {
    // 获取用户 ID；如果未登录则抛出错误
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: 正在为用户 ${userId} 创建 prompt...`);
    // 在插入的值中包含 user_id
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        name,
        description,
        content,
        user_id: userId, // 将 prompt 与已登录用户关联
      })
      .returning();

    console.log("Server Action: Prompt 已创建:", newPrompt);
    return newPrompt;
  } catch (error) {
    console.error("Server Action 错误 (createPrompt):", error);
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    throw new Error("创建 prompt 失败。");
  }
}

// --- 更新 Prompt ---
export async function updatePrompt({ id, name, description, content }: { id: number; name: string; description: string; content: string }) {
  try {
    // 获取用户 ID；如果未登录则抛出错误
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: 正在为用户 ${userId} 更新 prompt ${id}...`);
    // 使用 'and' 将 user_id 条件添加到 WHERE 子句
    const [updatedPrompt] = await db
      .update(prompts)
      .set({ name, description, content, updated_at: new Date() })
      .where(
        // 确保 prompt ID 和 user ID 都匹配
        and(eq(prompts.id, id), eq(prompts.user_id, userId))
      )
      .returning();

    // 检查是否真的更新了 prompt（如果 ID 存在但属于其他用户，则不会更新）
    if (!updatedPrompt) {
      throw new Error("Prompt 未找到或用户无权更新。");
    }

    console.log("Server Action: Prompt 已更新:", updatedPrompt);
    return updatedPrompt;
  } catch (error) {
    console.error("Server Action 错误 (updatePrompt):", error);
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    // 处理特定的 "未找到/无权" 情况
    if (error instanceof Error && error.message.includes("Prompt 未找到或用户无权")) {
       throw error;
    }
    throw new Error("更新 prompt 失败。");
  }
}

// --- 删除 Prompt ---
export async function deletePrompt(id: number) {
  try {
    // 获取用户 ID；如果未登录则抛出错误
    const userId = await requireUserId();
    await devDelay();

    console.log(`Server Action: 正在为用户 ${userId} 删除 prompt ${id}...`);
    // 使用 'and' 将 user_id 条件添加到 WHERE 子句
    const [deletedPrompt] = await db
      .delete(prompts)
      .where(
        // 确保 prompt ID 和 user ID 都匹配
        and(eq(prompts.id, id), eq(prompts.user_id, userId))
      )
      .returning();

    // 检查是否真的删除了 prompt
    if (!deletedPrompt) {
      throw new Error("Prompt 未找到或用户无权删除。");
    }

    console.log("Server Action: Prompt 已删除:", deletedPrompt);
    return deletedPrompt;
  } catch (error) {
    console.error("Server Action 错误 (deletePrompt):", error);
     if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("Prompt 未找到或用户无权")) {
       throw error;
    }
    throw new Error("删除 prompt 失败。");
  }
}