import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutProvider from '@/components/providers/LayoutProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agent Studio - AI 代理构建平台',
  description: '专业的 AI 代理构建和管理平台，支持可视化流程设计、多模型集成和智能对话',
  keywords: 'AI, 代理, 智能助手, 流程设计, 对话系统',
  authors: [{ name: 'Agent Studio Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
