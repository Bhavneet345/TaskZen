import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth" // ✅ Correct Import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskZen",
  description: "AI-powered task management application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <AuthProvider> {/* ✅ Wrap the entire app in `AuthProvider` */}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
