"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  TrendingUp,
  LineChart,
  Quote,
  Globe,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react"
import profileImage from "@/assets/profile.jpg"
import { SiTelegram, SiFacebook, SiTiktok, SiInstagram, SiYoutube } from "react-icons/si"

const socialLinks = [
  { label: "Telegram", href: "https://t.me/athenstrading", icon: SiTelegram },
  { label: "Facebook", href: "https://www.facebook.com/hasakalanka", icon: SiFacebook },
  { label: "TikTok", href: "https://www.tiktok.com/@saas.me", icon: SiTiktok },
  { label: "Instagram", href: "https://www.instagram.com/sahan__akalanka", icon: SiInstagram },
  { label: "YouTube", href: "https://youtube.com/@athensbysahan?si=Ol87ED9JQnU9xxoJ", icon: SiYoutube }
]

const highlightStats = [
  { title: "10+ Years", subtitle: "Trading Experience" },
  { title: "500+ Clients", subtitle: "Guided & Supported" },
  { title: "94% Signal", subtitle: "Accuracy (Gold Focus)" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-center lg:py-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-yellow-400 lg:justify-start">
                About Me
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Professional Trader &
                <span className="block gradient-text-gold"> Strategic Mentor</span>
              </h1>
              <p className="text-lg text-gray-300 md:text-xl">
                I’m Sahan Akalanka, founder of Athens International Education Centre LTD. My mission is to
                transform traders through disciplined execution, transparent performance, and premium education
                grounded in signal-driven strategies.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {highlightStats.map((item) => (
                  <motion.div
                    key={item.title}
                    className="rounded-2xl border border-yellow-400/20 bg-slate-900/60 px-4 py-5 text-center shadow-lg shadow-yellow-500/5"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  >
                    <p className="text-2xl font-semibold text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-wider text-yellow-400/80">{item.subtitle}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                <Button asChild size="lg" className="btn-material">
                  <Link href="/posts" className="flex items-center gap-2">
                    Explore Performance
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="btn-material-outline">
                  <Link href="/account-management">Account Management</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto flex w-full max-w-sm justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/30 via-transparent to-blue-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-yellow-400/20 bg-slate-900/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
                  <Image
                    src={profileImage}
                    alt="Sahan Akalanka portrait"
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                <motion.div
                  className="absolute -bottom-6 left-1/2 w-48 -translate-x-1/2 rounded-2xl border border-yellow-400/20 bg-slate-900/80 px-4 py-3 text-center text-sm text-yellow-300 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Verified Signal Provider
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

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
