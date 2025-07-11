// 导入 React 相关依赖
import React from "react";
// 导入头像占位符图片
import Image from "next/image";

// 主页组件
export default function HomePage() {
  return (
    // 主体区域，内容区居中，最大宽度限制
    <div className="flex flex-col items-center justify-center w-full px-4">
      {/* 个人简介区卡片，深灰半透明背景，毛玻璃、阴影、圆角 */}
      <section
        className="w-full max-w-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 mt-12 mb-8 backdrop-blur-md"
        style={{
          background: "rgba(40,40,50,0.85)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
        }}
      >
        {/* 头像占位符 */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#00ffff] shadow-lg">
          <Image
            src="/avatar-placeholder.svg"
            alt="头像"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>
        {/* 姓名，亮紫到亮青渐变字 */}
        <h1
          className="text-3xl font-bold tracking-tight text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(90deg, #9c27b0, #00ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          你的姓名
        </h1>
        {/* 简要介绍 */}
        <p className="text-base text-gray-200 text-center max-w-md font-medium">
          这里是你的个人简介。你可以简单介绍你的学术背景、研究方向或兴趣。
        </p>
      </section>
      {/* 欢迎语卡片 */}
      <section
        className="w-full max-w-2xl rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-md"
        style={{
          background: "rgba(40,40,50,0.85)",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.35)",
        }}
      >
        <h2
          className="text-xl font-semibold mb-2 text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(90deg, #00ffff, #9c27b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          欢迎来到我的学术主页！
        </h2>
        <p className="text-gray-200">
          这里将展示我的简历、研究兴趣、读书笔记、博客和出版物等内容。欢迎浏览与交流！
        </p>
      </section>
      {/* 主内容区卡片（后续可扩展） */}
      <main
        className="w-full max-w-3xl rounded-2xl shadow p-8 backdrop-blur-md"
        style={{
          background: "rgba(40,40,50,0.85)",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.25)",
        }}
      >
        <div className="text-center text-gray-400 py-8">
          主内容区占位符，后续可扩展为博客、出版物等模块。
        </div>
      </main>
    </div>
  );
}