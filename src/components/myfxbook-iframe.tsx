"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, BarChart3, TrendingUp, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface TradingSite {
  title: string
  url: string
  description: string
}

export function MyFXBookIframe() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tradingSites: TradingSite[] = [
    {
      title: "Athens By Sahan 019",
      url: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
      description: "View live trading performance and statistics"
    },
    {
      title: "Athens By Sahan 020",
      url: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
      description: "Real-time market analysis and metrics"
    }
  ]

  const handleRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
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
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Live Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            View MyFXBook
            <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Trading Channels
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Access real-time trading performance and verified statistics
          </p>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-material text-lg px-12 py-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-2xl hover:shadow-yellow-500/50"
                >
                  <TrendingUp className="w-6 h-6 mr-3" />
                  View Channels
                  <Sparkles className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border-yellow-400/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <DialogHeader className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <BarChart3 className="w-10 h-10 text-white" />
              </motion.div>
              <DialogTitle className="text-3xl font-bold text-white mb-2">
                Select Trading Site
              </DialogTitle>
              <p className="text-gray-400">
                Choose a site to view live trading performance
              </p>
            </DialogHeader>

            {/* Trading Sites List */}
            <div className="space-y-4">
              <AnimatePresence>
                {tradingSites.map((site, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <motion.button
                      onClick={() => handleRedirect(site.url)}
                      className="w-full text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <motion.div
                              className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <TrendingUp className="w-7 h-7 text-white" />
                            </motion.div>

                            {/* Content */}
                            <div>
                              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                                {site.title}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {site.description}
                              </p>
                            </div>
                          </div>

                          {/* Arrow */}
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                              <ExternalLink className="w-5 h-5 text-yellow-400" />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Close Button */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-yellow-400"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
