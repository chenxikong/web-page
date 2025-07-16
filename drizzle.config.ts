import { config } from "dotenv"; // 导入 dotenv 以加载环境变量
import { defineConfig } from "drizzle-kit"; // 从 drizzle-kit 导入
defineConfig
// 从 .env.local 文件加载环境变量
config({ path: ".env.local" });
// 从 process.env 中获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;
// 验证 DATABASE_URL 是否已设置
if (!connectionString) {
throw new Error("DATABASE_URL environment variable is not set. Pleasecheck your .env.local file.");
}
// 为 Drizzle Kit 导出配置对象
export default defineConfig({
/**
* 指定包含你的 Drizzle 模式文件的目录。
* Drizzle Kit 会监视这个目录的变更。
*/
schema: "./db/schema",
/**
* 指定 Drizzle Kit 将生成的 SQL 迁移文件
* 输出到的目录。
*/
out: "./db/migrations",
/**
* 指定数据库方言。对于 PostgreSQL（Supabase 使用的数据库），
* 这里应为 "postgresql"。
* */
dialect: "postgresql",
/**
* 提供 Drizzle Kit 连接数据库所需的凭据，
* 主要用于在生成迁移时进行内省 (introspection)。
*/
dbCredentials: {
url: connectionString,
}
});