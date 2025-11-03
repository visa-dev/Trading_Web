"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MyFXBookIframe() {

  return (
    <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
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
            <ExternalLink className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Live Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            MyFXBook
            <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Live Profile
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Real-time trading performance and verified statistics on MyFXBook
          </p>
        </motion.div>

        {/* Iframe Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="card-material bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-yellow-400/20 shadow-2xl overflow-hidden rounded-xl">
            {/* Iframe */}
            <div className="w-full" style={{ height: '900px' }}>
              <iframe
                src="https://www.myfxbook.com/members/ATHENSbySAHAN"
                className="w-full h-full border-0"
                title="ATHENSbySAHAN MyFXBook Profile"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Fallback Link */}
          <div className="text-center mt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="btn-material text-lg px-8 py-6"
              >
                <a
                  href="https://www.myfxbook.com/members/ATHENSbySAHAN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Full Profile on MyFXBook
                </a>
              </Button>
            </motion.div>
            <p className="text-sm text-gray-400 mt-3">
              If the preview doesn't load properly, click the button above to open the profile in a new tab
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

