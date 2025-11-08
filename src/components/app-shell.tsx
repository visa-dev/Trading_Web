"use client"

import { Navigation } from "@/components/navigation"
import { ConditionalFloatingChat } from "@/components/conditional-floating-chat"
import { SessionDebug } from "@/components/session-debug"
import { Toaster } from "sonner"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="pt-20 sm:pt-24">{children}</main>
      <ConditionalFloatingChat />
      <SessionDebug />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "var(--elevation-3)",
            color: "var(--card-foreground)",
          },
        }}
      />
    </>
  )
}

