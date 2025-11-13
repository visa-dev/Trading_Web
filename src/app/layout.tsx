import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { AppShell } from "@/components/app-shell"
import "./globals.css"
import { inter, spaceGrotesk, jetBrainsMono, orbitron } from "@/lib/fonts"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sahan Akalanka - Trading Performance Showcase",
  description: "Professional trading performance tracking and analysis platform with signal-driven insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} ${orbitron.variable} dark`}
      suppressHydrationWarning
    >
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