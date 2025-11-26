import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TALKSY - Chat-Based Social Media",
  description: "Connect through conversations",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-background text-foreground`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
