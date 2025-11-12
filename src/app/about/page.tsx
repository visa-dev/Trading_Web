"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  TrendingUp,
  LineChart,
  Quote,
  Globe,
  Mail,
  Phone
} from "lucide-react"
import { SiTelegram, SiFacebook, SiTiktok, SiInstagram, SiYoutube } from "react-icons/si"

const socialLinks = [
  { label: "Telegram", href: "https://t.me/athenstrading", icon: SiTelegram },
  { label: "Facebook", href: "https://www.facebook.com/hasakalanka", icon: SiFacebook },
  { label: "TikTok", href: "https://www.tiktok.com/@saas.me", icon: SiTiktok },
  { label: "Instagram", href: "https://www.instagram.com/sahan__akalanka", icon: SiInstagram },
  { label: "YouTube", href: "https://youtube.com/@athensbysahan?si=Ol87ED9JQnU9xxoJ", icon: SiYoutube }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="max-w-5xl mx-auto px-4 space-y-14">
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400/90">
            <Shield className="mr-2 h-4 w-4" /> About Me – Sahan Akalanka
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Professional Trader & Founder of Athens International Education Centre LTD
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            I’m dedicated to empowering traders through disciplined execution, transparent services, and education that bridges the gap between traditional learning and modern market mastery.
          </p>
        </header>

        <Card className="card-material border border-slate-800/60 bg-slate-900/60">
          <CardHeader className="space-y-3">
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-yellow-400" /> Who I Am
            </CardTitle>
            <CardDescription className="text-gray-300">
              A decade of Gold trading experience and a mission to elevate traders worldwide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300">
            <section className="space-y-3">
              <p>
                I’m Sahan Akalanka, a professional Gold trader with over 10 years of experience in global financial markets and the founder of Athens International Education Centre LTD, a UK-registered institute focused on practical education and skill-based learning.
              </p>
              <p>
                Trading has been more than a career—it’s a lifelong journey in discipline, patience, and growth. My goal is simple: help others achieve financial freedom through knowledge, strategy, and consistency.
              </p>
            </section>

            <Separator className="bg-slate-800" />

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">My Trading Journey</h2>
              <p>
                Curiosity about market structure and why many traders fail led me to study price action, ICT concepts, and smart money principles. Over the years, I refined a strategy centered on Gold (XAU/USD) that blends technical precision with psychological discipline.
              </p>
              <p>
                Every position I take is rooted in structure and logic, never emotion. The focus is always on high-probability setups with controlled risk.
              </p>
            </section>

            <Separator className="bg-slate-800" />

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white">What I Offer</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-yellow-400">💰</span> Account Management – Professional trading on your live account with strict risk control and transparent profit sharing.</li>
                <li className="flex items-start gap-2"><span className="text-yellow-400">🤝</span> Copy Trading – Mirror my trades automatically while staying in full control.</li>
                <li className="flex items-start gap-2"><span className="text-yellow-400">🎓</span> Mentorship &amp; Training – Learn Gold trading, ICT concepts, and mindset mastery through structured programs.</li>
              </ul>
              <p>
                Every service runs on trust and transparency—you stay in charge of your funds and learning journey at all times.
              </p>
            </section>

            <Separator className="bg-slate-800" />

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">My Trading Philosophy</h2>
              <blockquote className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-5 py-4 text-sm text-gray-200 flex gap-3">
                <Quote className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span>
                  Trading is not about luck—it’s about structure, patience, and emotional control. Profit comes naturally when discipline becomes your habit.
                </span>
              </blockquote>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-slate-900/40 px-4 py-3 border border-slate-800/60">Knowledge before profit</div>
                <div className="rounded-lg bg-slate-900/40 px-4 py-3 border border-slate-800/60">Smart risk management</div>
                <div className="rounded-lg bg-slate-900/40 px-4 py-3 border border-slate-800/60">Psychological mastery</div>
                <div className="rounded-lg bg-slate-900/40 px-4 py-3 border border-slate-800/60">Consistency over hype</div>
              </div>
            </section>

            <Separator className="bg-slate-800" />

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">My Mission</h2>
              <p>
                Through Athens International Education Centre LTD, I’m building pathways for traders to gain technical mastery, mindset development, and confidence. The goal: create a new generation of disciplined, profitable traders.
              </p>
              <blockquote className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-5 py-4 text-sm text-gray-200 flex gap-3">
                <Quote className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span>
                  Beyond Education – Towards Excellence.
                </span>
              </blockquote>
            </section>
          </CardContent>
        </Card>

        <Card className="card-material border border-slate-800/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <LineChart className="h-6 w-6 text-yellow-400" /> Connect With Me
            </CardTitle>
            <CardDescription className="text-gray-300">
              Founder: Athens International Education Centre LTD (UK)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white">
              <Link href="https://www.sahanakalanka.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-yellow-400/60 transition-colors flex items-center gap-2">
                <Globe className="h-4 w-4 text-yellow-400" /> www.sahanakalanka.com
              </Link>
              <Link href="mailto:info@sahanakalanka.com" className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-yellow-400/60 transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4 text-yellow-400" /> info@sahanakalanka.com
              </Link>
              <Link href="tel:+94776387655" className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-yellow-400/60 transition-colors flex items-center gap-2">
                <Phone className="h-4 w-4 text-yellow-400" /> 077 638 7655
              </Link>
            </div>

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
  )
}
