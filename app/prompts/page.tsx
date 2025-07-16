// app/prompts/page.tsx
import { getPrompts } from "@/actions/prompts-actions"; // 导入服务器操作
import { Header } from "@/components/header";
import { Suspense } from "react"; // 导入 Suspense
import { LoadingGrid } from "./_components/loading-grid"; // 导入加载组件
import { PromptsGrid } from "./_components/prompts-grid";

// 选择不使用缓存
export const dynamic = "force-dynamic";

// 保留为默认导出，但我们不会在这里直接获取数据以配合 Suspense
export default async function PromptsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            我的提示
          </h1>

          {/* 使用 Suspense 来处理加载状态 */}
          <Suspense fallback={<LoadingGrid />}>
             {/* 渲染一个中间的异步组件来处理数据获取 */}
            <PromptsLoader />
          </Suspense>
        </div>
      </div>
    </>
  );
}
/**
 * 一个负责获取数据的异步服务器组件。
 * React Suspense 会捕获在这里等待的 promise，并显示 fallback 内容。
 */
async function PromptsLoader() {
    // 使用服务器操作获取提示数据
    const prompts = await getPrompts();
  
    // 数据准备好后，用数据渲染客户端组件
    return <PromptsGrid initialPrompts={prompts} />;
  }