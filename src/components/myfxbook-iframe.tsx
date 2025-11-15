"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CORE_PERFORMANCE_LINKS, ADDITIONAL_PERFORMANCE_LINKS } from "@/lib/constants"

export function MyFXBookIframe() {
  const [showExtras, setShowExtras] = useState(false)

  const combinedLinks = useMemo(() => {
    return showExtras 
      ? [...CORE_PERFORMANCE_LINKS, ...ADDITIONAL_PERFORMANCE_LINKS]
      : CORE_PERFORMANCE_LINKS
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-4">
            View Live Performance
            <span
              className="block gradient-text-gold animate-gradient"
              style={{ backgroundSize: "200% 200%" }}
            >
              Trading Channels
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-4 px-4">
            Access real-time trading performance and verified statistics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {combinedLinks.map((link, index) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-gray-800/60 to-gray-900/60 p-6 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.1 }}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm">{link.description}</p>
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
