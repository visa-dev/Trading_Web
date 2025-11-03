import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navigation } from "@/components/navigation"
import { ConditionalFloatingChat } from "@/components/conditional-floating-chat"
import { SessionDebug } from "@/components/session-debug"
import { Toaster } from "sonner"

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
          <Navigation />
          <main className="pt-20 sm:pt-24">{children}</main>
          <ConditionalFloatingChat />
          <SessionDebug />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--elevation-3)',
                color: 'var(--card-foreground)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}