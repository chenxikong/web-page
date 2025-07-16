// app/page.tsx
"use client"; // 标记为客户端组件以实现交互性
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Home() {
const router = useRouter(); // 用于程序化导航的 Hook
return (
  <>
  <Header /> {/* 引入共享的页头 */}
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b
  from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
  {/* 使用 pt-16 (对应 h-16) 来为固定页头下的内容提供偏移 */}
  <motion.main
  className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  >
  <motion.h1 /* 标题 */
  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900
  dark:text-white mb-6"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
  >
  Prompt Manager
  </motion.h1>
  <motion.p /* 描述 */
  className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 maxw-3xl mx-auto"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.8 }}
  >
  在一个地方存储、组织和管理你所有的 AI 提示。通过轻松访问你最喜欢的提示来提高你的
  生产力。
  </motion.p>
  <motion.div /* 按钮 */
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6, duration: 0.8 }}
  >
  <button
  onClick={() => router.push("/prompts")} // 点击时导航
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3
  px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
  >
  开始使用
  </button>
  </motion.div>
  </motion.main>
  </div>
  </>
);
}