"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Shield, Target, ArrowRight, Zap, Star, Sparkles, Rocket, CheckCircle, Award, Users, Calendar } from "lucide-react"
import { 
  pageVariants, 
  pageTransition, 
  containerVariants,
  itemVariants,
  textRevealVariants,
  scaleBounceVariants,
  floatVariants
} from "@/lib/animations"

import profile from '@/assets/profile.jpg'

export function Hero() {
  const achievements = [
    { icon: TrendingUp, value: "94%", label: "Win Rate", color: "text-green-400" },
    { icon: BarChart3, value: "127", label: "Total Trades", color: "text-blue-400" },
    { icon: Shield, value: "3.8%", label: "Max Drawdown", color: "text-yellow-400" },
    { icon: Target, value: "2.4", label: "Risk/Reward", color: "text-purple-400" }
  ]

  const personalInfo = [
    { icon: Calendar, text: "10+ Years Experience", color: "text-yellow-400" },
    { icon: Award, text: "Professional Trader", color: "text-blue-400" },
    { icon: Users, text: "500+ Clients Served", color: "text-purple-400" }
  ]

  return (
    <motion.div 
      className="relative min-h-screen hero-bg overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs with subtle effects */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto container-responsive section-spacing">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Column - Photo and Personal Information */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Professional Photo */}
            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <div className="relative w-80 h-80 mx-auto lg:mx-0">
                <motion.div
                  className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img
                    src={profile.src as string}
                    alt="Sahan Akalanka - Professional Trader"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Floating badges around photo */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Verified Trader
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Award className="w-4 h-4 inline mr-1" />
                  AI Expert
                </motion.div>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-white dark:text-white light:text-navy-900 mb-2">
                  Sahan Akalanka
                </h2>
                <p className="text-xl text-yellow-400 dark:text-yellow-400 light:text-yellow-600 font-medium">
                  Professional Trading Expert & AI Analyst
                </p>
              </motion.div>

              <motion.div
                className="space-y-4"
                variants={containerVariants}
              >
                {personalInfo.map((info, index) => (
                  <motion.div
                    key={info.text}
                    variants={itemVariants}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center ${info.color}`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <span className="text-white dark:text-white light:text-navy-800 font-medium">
                      {info.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                className="text-lg text-gray-300 dark:text-gray-300 light:text-navy-700 leading-relaxed"
                variants={itemVariants}
              >
                Specialized in Gold & Forex markets with a proven track record of delivering consistent returns through advanced AI-powered trading strategies and institutional-grade risk management.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right Column - Performance Stats and CTA */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Performance Heading */}
            <motion.div
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <div className="inline-flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">
                  Live Performance
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-white dark:text-white light:text-navy-900 mb-4">
                Trading
                <span className="block gradient-text-gold mt-2 animate-gradient" style={{ backgroundSize: "200% 200%" }}>
                  Excellence
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 dark:text-gray-300 light:text-navy-700 max-w-lg mx-auto lg:mx-0">
                Real-time performance metrics from advanced AI-driven trading algorithms
              </p>
            </motion.div>

            {/* Performance Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {achievements.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="card-material p-6 text-center hover:border-yellow-400/50 transition-all duration-300">
                    <motion.div
                      className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${
                        stat.label === 'Win Rate' ? 'from-green-500/20 to-emerald-500/20' :
                        stat.label === 'Total Trades' ? 'from-blue-500/20 to-cyan-500/20' :
                        stat.label === 'Max Drawdown' ? 'from-yellow-500/20 to-orange-500/20' :
                        'from-purple-500/20 to-pink-500/20'
                      } flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
                      variants={scaleBounceVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className={`text-2xl font-bold mb-2 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-400 light:text-navy-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="btn-material text-lg px-8 py-4">
                  <Link href="/posts" className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2" />
                    View Performance
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="btn-material-outline text-lg px-8 py-4">
                  <Link href="/auth/signin" className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Trading
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        variants={floatVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center cursor-pointer hover:border-orange-400 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}