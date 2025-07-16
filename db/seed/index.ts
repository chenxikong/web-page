// db/seed/index.ts
import { db } from "@/db";
import { prompts } from "../schema/prompts-schema"; // 假设 prompts schema 在这里

// --- Clerk 后端客户端设置 ---
import { createClerkClient } from "@clerk/backend";

// 确保 Clerk Secret Key 可用 (添加基本验证)
if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY 环境变量未设置。");
}
// 初始化 Clerk 后端客户端
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
// --- Clerk 设置结束 ---

// --- 测试用户定义 ---
// 使用 +clerk_test@example.com 格式以便于识别
const testUsers = [
    {
        emailAddress: ["user1+clerk_test@example.com"],
        password: "testPassword123!", // 即使是测试也请使用安全密码
        firstName: "Test",
        lastName: "User1"
    },
    {
        emailAddress: ["user2+clerk_test@example.com"],
        password: "testPassword123!",
        firstName: "Test",
        lastName: "User2"
    },
    {
        emailAddress: ["user3+clerk_test@example.com"],
        password: "testPassword123!",
        firstName: "Test",
        lastName: "User3"
    }
];
// --- 测试用户定义结束 ---

// --- 基础 Prompt 数据 (尚未包含 user_id) ---
const basePrompts = [
    { name: "代码解释器", description: "用简单的术语解释代码", content: "解释这段代码..." },
    { name: "错误查找器", description: "帮助识别错误", content: "在这段代码中查找错误..." },
    { name: "功能规划器", description: "帮助规划功能", content: "规划这个功能..." },
    { name: "SQL 助手", description: "协助编写 SQL", content: "为...编写 SQL" },
    { name: "API 文档编写器", description: "生成 API 文档", content: "为这个 API 编写文档..." },
    { name: "代码重构器", description: "提出改进建议", content: "重构这段代码..." },
    { name: "测试用例生成器", description: "创建测试用例", content: "为...生成测试" },
    { name: "UI/UX 评审员", description: "评审 UI/UX", content: "评审这个 UI..." },
    { name: "Git 命令助手", description: "帮助使用 Git", content: "用于...的 Git 命令" },
    // 如果需要可以添加更多，目标是测试用户数量的倍数 (例如，3 个用户对应 9 个 prompt)
];
// --- 基础 Prompt 数据结束 ---

async function seed() {
    try {
        console.log("🌱 开始数据库填充...");

        // --- 通过 Clerk API 创建测试用户 ---
        console.log("正在通过 Clerk API 创建测试用户...");
        // 可选：为实现幂等性，先删除已存在的测试用户
        // const existingTestUsers = await clerk.users.getUserList({ emailAddress: testUsers.flatMap(u => u.emailAddress) });
        // if (existingTestUsers.data.length > 0) {
        //   console.log(`正在删除 ${existingTestUsers.data.length} 个已存在的测试用户...`);
        //   await Promise.all(existingTestUsers.data.map(user => clerk.users.deleteUser(user.id)));
        // }

        // 并发创建用户
        const createdUsers = await Promise.all(
            testUsers.map(userData => clerk.users.createUser(userData))
        );
        console.log(`成功创建 ${createdUsers.length} 个测试用户:`, createdUsers.map(u => ({ id: u.id, email: u.emailAddresses[0]?.emailAddress })));
        // --- 用户创建结束 ---

        // --- 准备带有用户 ID 的 Prompts ---
        if (createdUsers.length === 0) {
            throw new Error("没有创建任何测试用户。无法继续填充 prompts。");
        }
        // 将 prompts 分配给已创建的用户 (例如，轮询或分配块)
        // 这里，我们将每 3 个 prompt 分配给一个用户 (假设有 9 个基础 prompt 和 3 个用户)
        const promptsWithUsers = basePrompts.map((prompt, index) => {
            const userIndex = Math.floor(index / (basePrompts.length / createdUsers.length));
            const userId = createdUsers[userIndex].id;
            if (!userId) {
                throw new Error(`无法获取用户索引 ${userIndex} 的 userId`);
            }
            return {
                ...prompt,
                user_id: userId, // 分配 Clerk 用户 ID
            };
        });
        // --- Prompt 准备结束 ---

        // --- 填充数据库 ---
        console.log("🗑️ 正在从 'prompts' 表中清除现有数据...");
        await db.delete(prompts); // 首先清除现有的 prompts

        console.log("📥 正在向 'prompts' 表中插入种子数据...");
        await db.insert(prompts).values(promptsWithUsers); // 插入带有 user_id 的 prompts
        // --- 数据库填充结束 ---

        console.log("✅ 数据库填充成功完成！");

    } catch (error) {
        console.error("❌ 数据库填充期间发生错误:", error);
        // 如果有的话，记录特定的 Clerk 错误
        if (error instanceof Object && 'errors' in error) {
            console.error("Clerk API 错误:", (error as { errors: unknown[] }).errors);
        }
        throw error; // 重新抛出错误以表示脚本失败
    } finally {
        // 重要：确保数据库连接被关闭
        // 如果 drizzle-kit 会处理，这可能不是严格必需的，
        // 但对于独立脚本来说是良好实践。
        // await db.$client.end(); // 如果直接使用 node，则取消注释
        console.log("🚪 种子脚本执行完毕。");
    }
}

// 运行 seed 函数
seed();