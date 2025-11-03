"use client"

import { motion } from "framer-motion"
import { ExternalLink, TrendingUp, TrendingDown, Shield, Award, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TradingSystem {
  name: string
  gain: string
  drawdown: string
  leverage: string
  platform: string
  type: "Real"
}

interface TraderProfile {
  name: string
  joinedDate: string
  experience: string
  location: string
  bio: string
  tradingStyle: string
  motto: string
  systems: TradingSystem[]
  connections: number
}

export function MyFXBookTraderProfile() {
  const traderProfile: TraderProfile = {
    name: "ATHENSbySAHAN",
    joinedDate: "Sep 15, 2025",
    experience: "More than 5 years",
    location: "Sri Lanka",
    bio: "Founder of Athens International Education Centre (AIEC) – a UK-registered institute dedicated to empowering traders and professionals. Experienced Forex and Gold trader specializing in account management, copy trading, and risk management.",
    tradingStyle: "Price Action, ICT Concepts, Support/Resistance, and Smart Money Strategies on Forex and Gold (XAUUSD). Focus on disciplined risk management, consistency, and steady portfolio growth.",
    motto: "Beyond Education – Towards Excellence",
    connections: 0,
    systems: [
      {
        name: "Athens By Sahan 01",
        gain: "+472.32%",
        drawdown: "34.94%",
        leverage: "1:500",
        platform: "MetaTrader 5",
        type: "Real"
      },
      {
        name: "Athnes by Sahan 02",
        gain: "+294.35%",
        drawdown: "32.07%",
        leverage: "1:500",
        platform: "MetaTrader 5",
        type: "Real"
      },
      {
        name: "Athnes by sahan 03",
        gain: "+1,242.01%",
        drawdown: "51.54%",
        leverage: "1:200",
        platform: "MetaTrader 5",
        type: "Real"
      }
    ]
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Header Section */}
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white gradient-text-gold">
              {traderProfile.name}
            </h2>
            <p className="text-gray-400">Professional Forex & Gold Trader</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            Joined {traderProfile.joinedDate}
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-yellow-400" />
            {traderProfile.experience}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-yellow-400" />
            {traderProfile.location}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-gray-300 leading-relaxed mb-4">{traderProfile.bio}</p>
          <p className="text-gray-400 italic">&quot;{traderProfile.motto}&quot;</p>
        </div>
      </motion.div>

      {/* Trading Style */}
      <motion.div className="mb-8" variants={itemVariants}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
              Trading Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{traderProfile.tradingStyle}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trading Systems Performance */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Live Trading Systems Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traderProfile.systems.map((system) => (
            <motion.div
              key={system.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{system.name}</CardTitle>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {system.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{system.gain}</p>
                      <p className="text-sm text-gray-400">Total Gain</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{system.drawdown}</p>
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Leverage:</span>
                      <span className="text-white">{system.leverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform:</span>
                      <span className="text-white">{system.platform}</span>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MyFXBook Link */}
      <motion.div className="mt-8 text-center" variants={itemVariants}>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
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
        <p className="text-gray-400 text-sm mt-2">
          Live performance data and detailed trading statistics
        </p>
      </motion.div>
    </motion.div>
  )
}
