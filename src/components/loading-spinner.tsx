"use client"

import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Zap } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TrendingUp className={`${iconSizes[size]} text-yellow-400`} />
        <BarChart3 className={`${iconSizes[size]} text-blue-400`} />
        <Zap className={`${iconSizes[size]} text-purple-400`} />
      </motion.div>

      <motion.p
        className="text-gray-400 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {message}
      </motion.p>
    </div>
  )
}
