import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sahan Akalanka - Trading Performance Showcase",
  description: "Professional trading performance tracking and analysis platform with AI-powered insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-yellow-200/30 selection:text-gray-900 transition-colors duration-300">
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}