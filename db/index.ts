import { config } from "dotenv"; // 用于加载环境变量
import { drizzle } from "drizzle-orm/postgres-js"; // Drizzle ORM 函数
import postgres from "postgres"; // 底层的 PostgreSQL 驱动
// 从 .env.local 加载环境变量
config({ path: ".env.local" });
// 获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;
// 验证连接字符串
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
    }
    // 创建底层的 PostgreSQL 客户端连接
    // 'prepare: false' 选项通常被推荐用于兼容
    // 像 Supabase 的 PgBouncer 这样的连接池或无服务器环境。
    const client = postgres(connectionString, { prepare: false });
    // 创建 Drizzle ORM 实例，包装底层的客户端
    // 这个 'db' 对象就是你的应用程序代码将用来进行查询的对象。
    export const db = drizzle(client);