import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '瘦了吗 - AI食物识别卡路里管理',
  description: '拍照识别食物热量，管理每日营养摄入',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
