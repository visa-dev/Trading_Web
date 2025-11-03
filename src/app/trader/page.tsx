"use client"

import { motion } from "framer-motion"
import { MyFXBookTraderProfile } from "@/components/myfxbook-trader-profile"
import { Footer } from "@/components/footer"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TraderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto container-responsive py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Live Performance Data</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto container-responsive py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MyFXBookTraderProfile />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Why Choose Our Trader?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Over 5 years of professional trading experience</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Verified performance on MyFXBook with live data</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Specialized in Forex and Gold (XAUUSD) trading</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Focus on risk management and consistent growth</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Educational background with Athens International Education Centre</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Trading Philosophy</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                &quot;Beyond Education – Towards Excellence&quot; - Our trader believes in combining 
                theoretical knowledge with practical experience to achieve consistent results.
              </p>
              <p>
                The trading approach focuses on Price Action, ICT Concepts, Support/Resistance, 
                and Smart Money Strategies, ensuring disciplined risk management and steady 
                portfolio growth.
              </p>
              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  <a
                    href="https://www.myfxbook.com/members/ATHENSbySAHAN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full MyFXBook Profile
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
