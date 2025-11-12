import { Inter, Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

