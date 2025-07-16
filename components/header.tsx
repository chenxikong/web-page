// components/header.tsx
"use client";

// 导入 Clerk 组件
import { Button } from "@/components/ui/button"; // 确保 Button 已导入
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Prompts", href: "/prompts" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo 部分 (保持不变) */}
                    <motion.div /* ... */ >
                        <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Prompt Manager
                        </span>
                    </motion.div>

                    {/* 导航 & 认证部分 */}
                    <nav className="flex items-center gap-6">
                        {/* 渲染导航项 - 决定是始终显示还是仅在登录时显示 */}
                        {/* 在本应用中，我们让它们始终显示 */}
                        {navItems.map((item) => (
                            <motion.div key={item.href} /* ... */ >
                                <Link href={item.href} className={`... ${pathname === item.href ? "..." : "..."}`} >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}

                        {/* --- Clerk 身份验证组件 --- */}
                        {/* 仅在用户已登录时显示的内容 */}
                        <SignedIn>
                            <UserButton /> {/* Clerk 的用户个人资料按钮 */}
                        </SignedIn>

                        {/* 仅在用户未登录时显示的内容 */}
                        <SignedOut>
                            {/* SignInButton 包裹我们的自定义按钮，使其能触发登录流程 */}
                            <SignInButton mode="modal">
                                {/* 你可以按自己喜欢的方式设计这个按钮的样式 */}
                                <Button>Sign in</Button>
                            </SignInButton>
                        </SignedOut>
                        {/* --- Clerk 身份验证组件结束 --- */}

                    </nav>
                </div>
            </div>
        </header>
    );
};