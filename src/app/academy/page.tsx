"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ExternalLink, BookOpen, Users, Award, Target, TrendingUp, Shield, Clock } from "lucide-react"

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
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold text-white font-heading gradient-text-gold">
              Trading Academy
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                <CardTitle className="text-2xl text-white flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-yellow-400" />
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
                    onClick={() => window.open('https://athenssl.com/', '_blank')}
                    className="btn-material w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Sahan Akalanka Website
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
                <CardTitle className="text-2xl text-white flex items-center">
                  <Award className="w-6 h-6 mr-3 text-yellow-400" />
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
              <CardTitle className="text-3xl text-white text-center">
                Course Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-yellow-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Foundation</h3>
                  <p className="text-gray-400">Learn the basics of trading, market structure, and essential concepts</p>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-yellow-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Intermediate</h3>
                  <p className="text-gray-400">Dive deeper into technical analysis and develop your trading strategy</p>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-yellow-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced</h3>
                  <p className="text-gray-400">Master advanced techniques and start live trading with confidence</p>
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Trading Journey?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of successful traders who have transformed their financial future with Athena SSL
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open('https://athenssl.com/', '_blank')}
                  className="btn-material text-lg px-8 py-3"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg px-8 py-3"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
