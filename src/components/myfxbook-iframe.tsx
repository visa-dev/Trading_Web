"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const coreLinks = [
  {
    title: "Account Management Performance",
    url: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
    description: "Primary SocialTradeTools dashboard showcasing managed accounts",
  },
  {
    title: "Signal Intelligence Dashboard",
    url: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
    description: "Real-time market analysis and verified statistics",
  },
]

const additionalLinks = [
  {
    title: "Diversified Strategy Feed",
    url: "https://my.socialtradertools.com/view/C3pe6Rbmad180C1Y",
    description: "Diversified trading strategy performance feed",
  },
  {
    title: "Advanced Equity Analytics",
    url: "https://my.socialtradertools.com/view/BdkyYOHAqk9WJPFt",
    description: "Extended account analytics and equity growth tracking",
  },
]

export function MyFXBookIframe() {
  const [showExtras, setShowExtras] = useState(false)

  const combinedLinks = useMemo(() => {
    return showExtras ? [...coreLinks, ...additionalLinks] : coreLinks
  }, [showExtras])

  return (
    <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto container-responsive relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">
              Live Performance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            View Live Performance
            <span
              className="block gradient-text-gold animate-gradient"
              style={{ backgroundSize: "200% 200%" }}
            >
              Trading Channels
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Access real-time trading performance and verified statistics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {combinedLinks.map((site, index) => (
              <motion.a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-gray-800/60 to-gray-900/60 p-6 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-14 h-14 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                      {site.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{site.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center md:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="btn-material-outline"
            onClick={() => setShowExtras((prev) => !prev)}
          >
            {showExtras ? "See Less" : "See More"}
          </Button>
        </div>
      </div>
    </section>
  )
}
