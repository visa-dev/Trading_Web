"use client"

import { motion } from "framer-motion"
import { CheckCircle, ExternalLink, DollarSign, TrendingUp, Shield, ArrowRight, Copy, Target, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CopyTradingPage() {
  const steps = [
    {
      number: 1,
      title: "Register a NordFX Trading Account",
      icon: Target,
      description: "Create your account to get started with copy trading",
      link: "https://my.nordfx.com/en/registration?invite=8de25086",
      linkText: "Register Now",
      details: [
        "Fill in your full name",
        "Enter your email & password",
        "Add your country & phone number",
        "Check your email and verify your account"
      ]
    },
    {
      number: 2,
      title: "Verify Your Account (KYC)",
      icon: Shield,
      description: "Complete verification for secure trading",
      details: [
        "Go to Profile → Verification",
        "Upload your National ID or Passport",
        "Provide proof of address (bill, bank statement, etc.)",
        "Verification usually takes a few hours"
      ]
    },
    {
      number: 3,
      title: "Deposit Funds",
      icon: DollarSign,
      description: "Fund your account to start trading",
      details: [
        "Log in to your NordFX Dashboard",
        "Click Finance → Deposit Funds",
        "Choose method: Bank card / Crypto / E-wallet",
        "Minimum $100 deposit (recommended $200+ for gold trading)"
      ]
    },
    {
      number: 4,
      title: "Join Sahan's Copy Trading System",
      icon: Copy,
      description: "Connect to Athens by Sahan copy trading account",
      link: "https://nord.social/portal/registration/subscription/83032/athens",
      linkText: "Join Copy Trading",
      details: [
        "Athens by Sahan – Copy Trading Account"
      ]
    },
    {
      number: 5,
      title: "Subscribe to Copy Trading",
      icon: TrendingUp,
      description: "Set up your automatic copying parameters",
      details: [
        "Click 'Subscribe' button",
        "Log in with your NordFX account details",
        "Choose your investment amount (e.g., $100, $200)",
        "Set copy ratio (default 1:1)",
        "Optional: Set stop loss limit",
        "Confirm to start copying automatically"
      ]
    },
    {
      number: 6,
      title: "Monitor Your Account",
      icon: BarChart3,
      description: "Track your performance in real-time",
      link: "https://nord.social",
      linkText: "View Dashboard",
      details: [
        "Go to Nord Social → Dashboard",
        "View all open trades",
        "Monitor profit percentage",
        "Check trade history updated in real time"
      ]
    },
    {
      number: 7,
      title: "Withdraw Profits Anytime",
      icon: DollarSign,
      description: "Cash out your earnings when ready",
      details: [
        "Go to Finance → Withdraw Funds",
        "Select your payment method",
        "Withdraw to your wallet or card",
        "Profit share system applies automatically"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 pt-24 pb-16">
      <div className="max-w-6xl mx-auto container-responsive">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <Copy className="w-6 h-6 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Copy Trading</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            ATHENS BY SAHAN
            <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Copy Trading Registration Guide
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Trade with Sahan | Powered by NordFX
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">Live Trading System</span>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-yellow-400/20 shadow-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <step.icon className="w-6 h-6 text-yellow-400" />
                        <CardTitle className="text-2xl text-white">
                          🔹 {step.title}
                        </CardTitle>
                      </div>
                      <p className="text-gray-300 text-lg">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Action Link */}
                    {step.link && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <a href={step.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            {step.linkText}
                            <ExternalLink className="w-5 h-5 ml-2" />
                          </a>
                        </Button>
                      </motion.div>
                    )}

                    {/* Details */}
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                      <div className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + idx * 0.05 }}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-200 text-base leading-relaxed">{detail}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/30 shadow-2xl">
            <CardContent className="p-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://my.nordfx.com/en/registration?invite=8de25086"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Copy className="w-6 h-6 mr-3" />
                  Start Your Copy Trading Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </motion.div>
              <p className="text-gray-300 text-lg mt-6">
                Join hundreds of traders already copying Sahan&apos;s strategies
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

