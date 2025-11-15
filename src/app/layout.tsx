import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { AppShell } from "@/components/app-shell"
import "./globals.css"
import { inter, spaceGrotesk, jetBrainsMono, orbitron } from "@/lib/fonts"
import {
  DEFAULT_PAGE_TITLE,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_KEYWORDS,
  BRAND_WEBSITE,
  BRAND_NAME,
} from "@/lib/constants"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: {
    default: DEFAULT_PAGE_TITLE,
    template: `%s | ${BRAND_NAME}`,
  },
  description: DEFAULT_META_DESCRIPTION,
  keywords: DEFAULT_META_KEYWORDS,
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  metadataBase: new URL(BRAND_WEBSITE),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND_WEBSITE,
    siteName: BRAND_NAME,
    title: DEFAULT_PAGE_TITLE,
    description: DEFAULT_META_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_PAGE_TITLE,
    description: DEFAULT_META_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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