"use client"

import { useTheme } from "@/contexts/theme-context"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse">
        <div className="w-4 h-4 bg-gray-400 rounded-full mt-0.5 ml-0.5"></div>
      </div>
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        theme === 'dark' ? 'bg-yellow-500' : 'bg-gray-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors duration-300 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-white translate-x-6' 
            : 'bg-white translate-x-0.5'
        }`}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-yellow-500" />
        ) : (
          <Sun className="w-3 h-3 text-gray-600" />
        )}
      </motion.div>
    </motion.button>
  )
}