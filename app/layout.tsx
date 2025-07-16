// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"; // <-- 导入 ClerkProvider
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = {
title: "Prompt Manager",
description: "Organize and manage your AI prompts efficiently.",
};
export default function RootLayout({ children }: Readonly<{ children:
  React.ReactNode }>) {
  return (
  <ClerkProvider>
  <html lang="en" suppressHydrationWarning>
  <body
  // 应用字体变量和基础的背景/文本颜色
  className={`${geistSans.variable} ${geistMono.variable} antialiased bggray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
  >
  {/* children 代表当前页面的内容 */}
  {children}
  </body>
  </html>
  </ClerkProvider>
  );
  }
  
