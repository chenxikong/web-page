// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// 定义无需身份验证即可公开访问的路由
const isPublicRoute = createRouteMatcher([
"/", // 根路径/营销页面
"/sign-in(.*)" // 登录页面
]);
// 导出中间件函数
export default clerkMiddleware(async (auth, req) => {
// 检查请求的路由是否【不是】公开的
if (!isPublicRoute(req)) {
// 如果它不是公开的，则强制执行身份验证
// auth().protect() 会将未经身份验证的用户重定向到登录页面
await auth.protect();
}
// 如果它【是】一个公开路由，中间件将不做任何进一步操作，
// 允许请求在没有身份验证检查的情况下继续进行。
});
// 中间件的配置对象
export const config = {
matcher: [
// 匹配除以下路由之外的所有路由：
// 1. Next.js 内部的 API 路由 (_next/...)
// 2. 静态文件（图像、字体、CSS等），除非在搜索参数中找到
// 3. Favicon 和其他静态资源
// 这确保了中间件仅在实际的页面/API请求上高效运行。
"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 始终为 API 路由（以 /api 或 /trpc 开头）运行中间件
"/(api|trpc)(.*)"
]
};