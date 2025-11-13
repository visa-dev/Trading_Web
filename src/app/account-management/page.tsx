"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Shield,
  LineChart,
  Lock,
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  Globe
} from "lucide-react"
import { SiTelegram, SiFacebook, SiTiktok, SiInstagram, SiYoutube } from "react-icons/si"

const howItWorks = [
  {
    title: "You Own the Account",
    description:
      "Open a trading account in your name with a trusted regulated broker like NordFX or Exness. Your funds always remain in your control.",
    details: "I execute trades on your behalf—withdrawal access stays with you."
  },
  {
    title: "Secure Connection",
    description:
      "I connect via copy trading or investor (read-only) access. I never receive direct fund control or withdrawal permissions.",
    details: "Risk management and execution are handled transparently." 
  },
  {
    title: "Live Transparency",
    description:
      "You can monitor every position in real-time on MT4/MT5. I also provide verified performance via MyFXBook or FXBlue.",
    details: "Stay informed with live dashboards and analytics."
  },
  {
    title: "Profit Sharing",
    description:
      "We settle profits weekly or monthly based on results. A 50/50 split is standard, with flexibility for account size and goals.",
    details: "Simple, fair, performance-based compensation."
  }
]

const tradingHighlights = [
  { icon: Target, label: "Daily Risk", value: "1% – 2% per trade" },
  { icon: TrendingUp, label: "Weekly Growth", value: "4% – 9% average" },
  { icon: BarChart3, label: "Primary Market", value: "Gold (XAU/USD)" },
  { icon: CheckCircle, label: "Strategy", value: "ICT • Price Action • Smart Money" }
]

const socialLinks = [
  { label: "Telegram", href: "https://t.me/athenstrading", icon: SiTelegram },
  { label: "Facebook", href: "https://www.facebook.com/hasakalanka", icon: SiFacebook },
  { label: "TikTok", href: "https://www.tiktok.com/@saas.me", icon: SiTiktok },
  { label: "Instagram", href: "https://www.instagram.com/sahan__akalanka", icon: SiInstagram },
  { label: "YouTube", href: "https://youtube.com/@athensbysahan?si=Ol87ED9JQnU9xxoJ", icon: SiYoutube }
]

const performanceLinks = [
  {
    label: "Account Management Performance",
    description: "Primary SocialTradeTools dashboard showcasing managed accounts",
    href: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
  },
  {
    label: "Signal Intelligence Dashboard",
    description: "SocialTradeTools live performance stream with verified statistics",
    href: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
  },
  {
    label: "Diversified Strategy Feed",
    description: "Cross-market performance feed highlighting diversified trades",
    href: "https://my.socialtradertools.com/view/C3pe6Rbmad180C1Y",
  },
  {
    label: "Advanced Equity Analytics",
    description: "Extended account analytics and equity growth tracking",
    href: "https://my.socialtradertools.com/view/BdkyYOHAqk9WJPFt",
  },
]

export default function AccountManagementPage() {
  const [showPerformanceLinks, setShowPerformanceLinks] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 space-y-14">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-4">
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400/90">
              <Shield className="mr-2 h-4 w-4" /> Account Management by Sahan Akalanka
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Smart, Transparent & Profitable Gold Trading — Managed Personally by Sahan
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Welcome to my Account Management Service, designed for traders who want consistent, realistic growth without the stress of daily execution. You maintain full control while I deliver expert trading decisions rooted in ICT, Price Action, and Smart Money concepts.
            </p>
          </div>
          <Button asChild variant="outline" className="btn-material-outline self-start">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>

        <Card className="card-material border border-slate-800/60 bg-slate-900/60">
          <CardHeader className="space-y-3">
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <LineChart className="h-6 w-6 text-yellow-400" /> How It Works
            </CardTitle>
            <CardDescription className="text-gray-300">
              A secure, collaborative partnership that keeps your capital safe while I handle execution and strategy.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howItWorks.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-6 shadow-2xl shadow-slate-950/40">
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                <Separator className="my-4 bg-slate-800" />
                <p className="text-sm text-yellow-400/90">{step.details}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-material border border-slate-800/60 bg-slate-900/60 lg:col-span-2">
            <CardHeader className="space-y-3">
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-yellow-400" /> My Trading Approach
              </CardTitle>
              <CardDescription className="text-gray-300">
                Focused, data-backed execution tailored to each account while protecting capital.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tradingHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border border-slate-800/70 bg-slate-900/40 px-5 py-4"
                  >
                    <div className="rounded-lg bg-yellow-500/10 text-yellow-400 p-3">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                I prioritize disciplined risk management with controlled drawdown while targeting sustainable weekly growth. Every position is executed with confluence across liquidity, institutional order flow, and macro context.
              </p>
            </CardContent>
          </Card>

          <Card className="card-material border border-slate-800/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-yellow-400" /> Why Choose Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> You maintain full control of your funds at all times.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> Proven gold trading experience with consistent results.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> Verified performance reporting via MyFXBook / FXBlue.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> Direct communication and support from me personally.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> No hidden fees, no lock-ins—just transparent profit sharing.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="card-material border border-slate-800/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-yellow-400" /> Account Requirements
            </CardTitle>
            <CardDescription className="text-gray-300">
              Choose a starting balance that aligns with your goals. Results may vary with market conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 text-center border border-slate-800/70 rounded-2xl overflow-hidden">
              <div className="bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-wide text-gray-400">Minimum Balance</p>
                <p className="mt-2 text-2xl font-semibold text-white">$1,000+</p>
              </div>
              <div className="bg-slate-900/70 p-6 border-y md:border-y-0 md:border-x border-slate-800/70">
                <p className="text-sm uppercase tracking-wide text-gray-400">Profit Share</p>
                <p className="mt-2 text-2xl font-semibold text-white">50 / 50</p>
              </div>
              <div className="bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-wide text-gray-400">Expected Monthly Growth</p>
                <p className="mt-2 text-2xl font-semibold text-white">20% – 40%</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              📊 Results are based on historical performance and prevailing market conditions. Trading involves risk and past performance does not guarantee future returns.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button
            asChild
            className="btn-material w-full sm:w-auto"
          >
            <Link href="/posts#performance" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Go Performance
            </Link>
          </Button>
          <Button
            variant="outline"
            className="btn-material-outline w-full sm:w-auto"
            onClick={() => setShowPerformanceLinks((prev) => !prev)}
          >
            Account Management Performance
          </Button>
        </div>

        {showPerformanceLinks && (
          <Card className="card-material border border-slate-800/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Account Management Performance</CardTitle>
              <CardDescription className="text-gray-300">
                Choose any of the verified SocialTradeTools dashboards to review managed account performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceLinks.map((link) => (
                <div
                  key={link.href}
                  className="rounded-xl border border-slate-800/60 bg-slate-900/40 px-5 py-4"
                >
                  <p className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                    {link.label}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">{link.description}</p>
                  <Button
                    asChild
                    size="sm"
                    className="btn-material mt-3"
                  >
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-material border border-slate-800/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-yellow-400" /> Start Your Journey Today
              </CardTitle>
              <CardDescription className="text-gray-300">
                Ready for managed performance? Let’s align your goals, risk, and execution plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                When you’re ready to scale safely and consistently, I’ll walk you through opening your broker account, connecting securely, and setting profit-sharing expectations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild className="btn-material text-base">
                  <Link href="tel:+94776387655">
                    <Phone className="mr-2 h-4 w-4" /> Call: 077 638 7655
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-material-outline text-base">
                  <Link href="mailto:info@sahanakalanka.com">
                    <Mail className="mr-2 h-4 w-4" /> info@sahanakalanka.com
                  </Link>
                </Button>
              </div>
              <Button asChild variant="secondary" className="w-full bg-slate-800/80 hover:bg-yellow-500 hover:text-slate-900 transition-colors">
                <Link href="https://www.sahanakalanka.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" /> www.sahanakalanka.com
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-material border border-slate-800/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <LineChart className="h-6 w-6 text-yellow-400" /> Follow Live Results & Updates
              </CardTitle>
              <CardDescription className="text-gray-300">
                Stay close to the markets and watch trades unfold in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-5 py-3 hover:border-yellow-400/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <social.icon className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{social.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">Follow</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

