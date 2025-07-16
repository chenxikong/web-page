// lib/dev-delay.ts
/**
* 在开发模式下添加人为的延迟。
* 对于测试加载状态很有用。
* @param ms 延迟的毫秒数 (默认: 1000ms 或 1 秒)
*/
export async function devDelay(ms: number = 1000): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, ms));
    }
    }