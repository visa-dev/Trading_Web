/**
 * Shared Constants and Configuration
 * 
 * This file contains all shared constants, configuration data, and reusable data structures
 * used across the application. This centralization ensures:
 * - Single source of truth for all common data
 * - Easy maintenance and updates
 * - Type safety with TypeScript
 * - Consistency across the application
 * - Better code organization
 * 
 * @module constants
 * @author Trading Performance Platform
 * @since 1.0.0
 */

import { Target, TrendingUp, BarChart3, CheckCircle } from "lucide-react"
import { SiTelegram, SiFacebook, SiTiktok, SiInstagram, SiYoutube } from "react-icons/si"
import type { LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"

/**
 * Performance link structure
 */
export interface PerformanceLink {
  label: string
  title: string
  description: string
  href: string
  url: string
}

/**
 * Social link structure
 */
export interface SocialLink {
  label: string
  name: string
  href: string
  icon: IconType
}

/**
 * Trading highlight structure
 */
export interface TradingHighlight {
  icon: LucideIcon
  label: string
  value: string
}

/**
 * How It Works step structure
 */
export interface HowItWorksStep {
  title: string
  description: string
  details: string
}

/**
 * Account requirement structure
 */
export interface AccountRequirement {
  label: string
  value: string
}

// ============================================================================
// BRAND INFORMATION
// ============================================================================

/**
 * Brand/Trader name
 */
export const BRAND_NAME = "Sahan Akalanka"

/**
 * Brand tagline/description
 */
export const BRAND_TAGLINE = "Professional trading performance tracking and analysis platform with signal-driven insights for the modern investor."

/**
 * Brand email (primary)
 */
export const BRAND_EMAIL = "info@athenssl.com"

/**
 * Brand email (alternative - for backward compatibility)
 */
export const BRAND_EMAIL_ALTERNATIVE = "info@sahanakalanka.com"

/**
 * Brand phone number (formatted for display)
 */
export const BRAND_PHONE_DISPLAY = "+94 77 638 7655"

/**
 * Brand phone number (formatted for tel: links)
 */
export const BRAND_PHONE_LINK = "+94776387655"

/**
 * Brand phone number (formatted without country code)
 */
export const BRAND_PHONE_SHORT = "077 638 7655"

/**
 * Brand website URL
 */
export const BRAND_WEBSITE = "https://athenssl.com/"

/**
 * Business hours
 */
export const BUSINESS_HOURS = "Mon-Fri: 9:00 AM - 6:00 PM EST"

// ============================================================================
// SEO & METADATA
// ============================================================================

/**
 * Default page title template
 * Used for SEO and metadata
 */
export const DEFAULT_PAGE_TITLE = `${BRAND_NAME} - Trading Performance Showcase`

/**
 * Default meta description
 * Used for SEO and social sharing
 */
export const DEFAULT_META_DESCRIPTION = BRAND_TAGLINE

/**
 * Default meta keywords for SEO
 */
export const DEFAULT_META_KEYWORDS = [
  "trading performance",
  "forex trading",
  "gold trading",
  "XAUUSD",
  "trading signals",
  "account management",
  "trading analysis",
  BRAND_NAME,
].join(", ")

/**
 * Default Open Graph image (if available)
 * Can be updated to point to your logo/OG image
 */
export const DEFAULT_OG_IMAGE = `${BRAND_WEBSITE}og-image.jpg`

/**
 * Generate page title with template
 * @param pageTitle - Optional page-specific title
 * @returns Formatted page title
 */
export const getPageTitle = (pageTitle?: string): string => {
  if (!pageTitle) return DEFAULT_PAGE_TITLE
  return `${pageTitle} | ${BRAND_NAME}`
}

/**
 * Account Management Performance Links
 * Shared across home page, account management page, and MyFXBook iframe component
 */
export const ACCOUNT_PERFORMANCE_LINKS: PerformanceLink[] = [
  {
    label: "Account Management Performance #1",
    title: "Account Management Performance #1",
    description: "Primary SocialTradeTools dashboard showcasing managed accounts",
    href: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
    url: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
  },
  {
    label: "Account Management Performance #2",
    title: "Account Management Performance #2",
    description: "Real-time market analysis and verified statistics",
    href: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
    url: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
  },
  {
    label: "Account Management Performance #3",
    title: "Account Management Performance #3",
    description: "Diversified trading strategy performance feed",
    href: "https://my.socialtradertools.com/view/C3pe6Rbmad180C1Y",
    url: "https://my.socialtradertools.com/view/C3pe6Rbmad180C1Y",
  },
  {
    label: "Account Management Performance #4",
    title: "Account Management Performance #4",
    description: "Extended account analytics and equity growth tracking",
    href: "https://my.socialtradertools.com/view/BdkyYOHAqk9WJPFt",
    url: "https://my.socialtradertools.com/view/BdkyYOHAqk9WJPFt",
  },
]

/**
 * Core performance links (first 2)
 */
export const CORE_PERFORMANCE_LINKS: PerformanceLink[] = ACCOUNT_PERFORMANCE_LINKS.slice(0, 2)

/**
 * Additional performance links (remaining 2)
 */
export const ADDITIONAL_PERFORMANCE_LINKS: PerformanceLink[] = ACCOUNT_PERFORMANCE_LINKS.slice(2)

// ============================================================================
// SOCIAL LINKS
// ============================================================================

/**
 * Social media links
 * Used across footer, hero, about page, and account management page
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Telegram",
    name: "Telegram",
    href: "https://t.me/athenstrading",
    icon: SiTelegram,
  },
  {
    label: "Facebook",
    name: "Facebook",
    href: "https://www.facebook.com/hasakalanka",
    icon: SiFacebook,
  },
  {
    label: "TikTok",
    name: "TikTok",
    href: "https://www.tiktok.com/@saas.me",
    icon: SiTiktok,
  },
  {
    label: "Instagram",
    name: "Instagram",
    href: "https://www.instagram.com/sahan__akalanka",
    icon: SiInstagram,
  },
  {
    label: "YouTube",
    name: "YouTube",
    href: "https://youtube.com/@athensbysahan?si=Ol87ED9JQnU9xxoJ",
    icon: SiYoutube,
  },
]

// ============================================================================
// TRADING INFORMATION
// ============================================================================

/**
 * Trading highlights/metrics
 * Used in account management page
 */
export const TRADING_HIGHLIGHTS: TradingHighlight[] = [
  { icon: Target, label: "Daily Risk", value: "1% – 2% per trade" },
  { icon: TrendingUp, label: "Weekly Growth", value: "4% – 9% average" },
  { icon: BarChart3, label: "Primary Market", value: "Gold (XAU/USD)" },
  { icon: CheckCircle, label: "Strategy", value: "ICT • Price Action • Smart Money" },
]

/**
 * How It Works steps for account management
 * Used in account management page
 */
export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    title: "You Own the Account",
    description:
      "Open a trading account in your name with a trusted regulated broker like NordFX or Exness. Your funds always remain in your control.",
    details: "I execute trades on your behalf—withdrawal access stays with you.",
  },
  {
    title: "Secure Connection",
    description:
      "I connect via copy trading or investor (read-only) access. I never receive direct fund control or withdrawal permissions.",
    details: "Risk management and execution are handled transparently.",
  },
  {
    title: "Live Transparency",
    description:
      "You can monitor every position in real-time on MT4/MT5. I also provide verified performance via MyFXBook or FXBlue.",
    details: "Stay informed with live dashboards and analytics.",
  },
  {
    title: "Profit Sharing",
    description:
      "We settle profits weekly or monthly based on results. A 50/50 split is standard, with flexibility for account size and goals.",
    details: "Simple, fair, performance-based compensation.",
  },
]

/**
 * Account requirements
 * Used in account management page
 */
export const ACCOUNT_REQUIREMENTS: AccountRequirement[] = [
  { label: "Minimum Balance", value: "$1,000+" },
  { label: "Profit Share", value: "50 / 50" },
  { label: "Expected Monthly Growth", value: "20% – 40%" },
]

