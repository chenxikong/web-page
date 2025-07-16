// actions/auth-actions.ts
"use server"; // 将此文件中的函数标记为 Server Actions 或仅在服务器端运行
import { auth } from "@clerk/nextjs/server"; // 导入服务器端 auth 辅助函数
/**
* 获取当前会话的 Clerk 用户 ID。
* 如果用户未通过身份验证，则抛出错误。
*
* @returns {Promise<string>} 已认证用户的 ID。
* @throws {Error} 如果用户未通过身份验证。
*/
export async function requireUserId(): Promise<string> {
// 获取身份验证上下文
const { userId } = await auth();
// 检查 userId 是否存在
if (!userId) {
// 如果用户未登录，则抛出错误
// 这个错误将被调用它的 Server Action 的 try/catch 块捕获
throw new Error("Unauthorized: User must be logged in.");
}
// 如果已认证，则返回 userId
return userId;
}
