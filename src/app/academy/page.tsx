"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ExternalLink, BookOpen, Users, Award, Target, TrendingUp, Shield, Clock } from "lucide-react"
import { BRAND_NAME, BRAND_WEBSITE, SOCIAL_LINKS } from "@/lib/constants"

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
            <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading gradient-text-gold text-center sm:text-left">
              Trading Academy
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            Master the art of trading with our comprehensive educational platform powered by Athena SSL
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* About Athena SSL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="card-material h-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white flex items-center flex-wrap gap-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  About Athena SSL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Athena SSL is a cutting-edge trading education platform designed to transform beginners into professional traders. 
                  Our comprehensive curriculum covers everything from basic market concepts to advanced trading strategies.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  With years of experience in financial markets, we provide real-world insights, practical tools, and personalized 
                  guidance to help you succeed in the competitive world of trading.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => window.open(BRAND_WEBSITE, '_blank')}
                    className="btn-material w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit {BRAND_NAME} Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="card-material h-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white flex items-center flex-wrap gap-2">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold">Technical Analysis</h3>
                      <p className="text-gray-400 text-sm">Master chart patterns, indicators, and market trends</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold">Risk Management</h3>
                      <p className="text-gray-400 text-sm">Learn to protect your capital and manage risk effectively</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold">Trading Psychology</h3>
                      <p className="text-gray-400 text-sm">Develop the mental discipline needed for consistent trading</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold">Live Trading Sessions</h3>
                      <p className="text-gray-400 text-sm">Practice with real market conditions and expert guidance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Course Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="card-material">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-white text-center px-4">
                Course Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-yellow-400">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Foundation</h3>
                  <p className="text-sm sm:text-base text-gray-400">Learn the basics of trading, market structure, and essential concepts</p>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-yellow-400">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Intermediate</h3>
                  <p className="text-sm sm:text-base text-gray-400">Dive deeper into technical analysis and develop your trading strategy</p>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-yellow-400">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Advanced</h3>
                  <p className="text-sm sm:text-base text-gray-400">Master advanced techniques and start live trading with confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="card-material max-w-4xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-4">
                Ready to Start Your Trading Journey?
              </h2>
              <p className="text-gray-300 mb-8 text-base sm:text-lg px-4">
                Join thousands of successful traders who have transformed their financial future with Athena SSL
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Button
                  onClick={() => window.open(BRAND_WEBSITE, '_blank', 'noopener,noreferrer')}
                  className="btn-material text-base sm:text-lg px-6 sm:px-8 py-3"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-base sm:text-lg px-6 sm:px-8 py-3"
                  onClick={() => {
                    const telegramLink = SOCIAL_LINKS.find(s => s.label === "Telegram")
                    if (telegramLink) {
                      window.open(telegramLink.href, '_blank', 'noopener,noreferrer')
                    }
                  }}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Join Our Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
