"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { User, LogOut, CheckCircle, Zap, BarChart3, TrendingUp, Menu, X, GraduationCap, Copy, Shield } from "lucide-react"
import Link from "next/link"
import { BRAND_NAME } from "@/lib/constants"

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sessionRole = (session?.user as { role?: string } | undefined)?.role ?? null

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const desktopNavClasses = (href: string) =>
    `group relative flex items-center space-x-2 text-sm font-medium transition-colors duration-300 ${
      isActive(href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
    } after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-yellow-400 after:transition-transform after:duration-300 group-hover:after:scale-x-100 ${
      isActive(href) ? "after:scale-x-100" : "after:scale-x-0"
    }`

  const mobileNavClasses = (href: string) =>
    `group flex items-center space-x-3 text-white transition-colors duration-300 py-2 ${
      isActive(href) ? "text-yellow-400" : "hover:text-yellow-400"
    }`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect border-b border-yellow-400/20 shadow-lg' 
          : 'glass-effect border-b border-yellow-400/10'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto container-responsive">
        <div className="flex items-center h-20 sm:h-24">
          {/* Mobile: Hamburger + Centered Brand */}
          <div className="flex items-center flex-1 md:flex-none md:w-auto">
            {!session || sessionRole !== "TRADER" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-yellow-400"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            ) : (
              <span className="md:hidden w-10" />
            )}

            <motion.div
              className="flex-1 flex justify-center md:justify-start md:pl-0 pl-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sessionRole === "TRADER" ? (
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      if (window.location.pathname === '/dashboard') {
                        window.location.reload()
                      } else {
                        window.location.href = '/dashboard'
                      }
                    }
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-heading gradient-text-gold cursor-pointer"
                >
                  {BRAND_NAME}
                </button>
              ) : (
                <Link href="/" className="block">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-heading gradient-text-gold cursor-pointer">
                    {BRAND_NAME}
                  </h1>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Desktop Navigation - Center */}
          {!session || sessionRole !== "TRADER" ? (
            <div className="hidden md:flex items-center space-x-8 md:mx-10">
              <Link href="/posts" className={desktopNavClasses("/posts")}>
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Performance</span>
              </Link>
              <Link href="/academy" className={desktopNavClasses("/academy")}>
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">Academy</span>
              </Link>
              <Link href="/copy-trading" className={desktopNavClasses("/copy-trading")}>
                <Copy className="w-5 h-5" />
                <span className="font-medium">Copy Trading</span>
              </Link>
              <Link href="/account-management" className={desktopNavClasses("/account-management")}>
                <Shield className="w-5 h-5" />
                <span className="font-medium">Account Management</span>
              </Link>
              <Link href="/about" className={desktopNavClasses("/about")}>
                <User className="w-5 h-5" />
                <span className="font-medium">About Me</span>
              </Link>
            </div>
          ) : null}

          {/* Right Side: User Avatar */}
          <div className="flex items-center space-x-4 flex-none ml-auto">
            {/* User Avatar and Auth */}
            {status === "loading" ? (
              <motion.div 
                className="w-8 h-8 bg-gray-600 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-800/50 transition-colors duration-300 group">
                      <Avatar className="h-8 w-8 border-2 border-yellow-400/50 shadow-lg group-hover:border-orange-400/50 transition-all duration-300">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white font-semibold">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 bg-slate-900/95 border border-yellow-400/20 shadow-2xl backdrop-blur-md" 
                  align="end" 
                  forceMount
                >
                  <div className="flex flex-col space-y-3 p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-yellow-400/50">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white font-semibold text-lg">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-semibold text-white font-heading">{session.user?.name}</div>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-xs text-gray-400">{session.user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        sessionRole === "TRADER" 
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>
                        {sessionRole ?? "USER"}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <div className="py-2">
                    {sessionRole !== "TRADER" && (
                      <DropdownMenuItem asChild className="hover:bg-gray-800/50 transition-colors duration-300">
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-2">
                          <User className="w-4 h-4" />
                          <span className="text-white">Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {sessionRole === "TRADER" && (
                      <DropdownMenuItem asChild className="hover:bg-gray-800/50 transition-colors duration-300">
                        <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2">
                          <BarChart3 className="w-4 h-4 text-yellow-400" />
                          <span className="text-white">Trader Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-500/20 text-red-400 transition-colors duration-300"
                    onSelect={(event) => {
                      event.preventDefault()
                      signOut()
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="btn-material">
                  <Link href="/auth/signin" className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (!session || sessionRole !== "TRADER") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-yellow-400/20"
          >
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/posts" 
                className={mobileNavClasses("/posts")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Performance</span>
              </Link>
              <Link 
                href="/academy" 
                className={mobileNavClasses("/academy")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">Academy</span>
              </Link>
              <Link 
                href="/copy-trading" 
                className={mobileNavClasses("/copy-trading")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Copy className="w-5 h-5" />
                <span className="font-medium">Copy Trading</span>
              </Link>
              <Link 
                href="/account-management" 
                className={mobileNavClasses("/account-management")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Account Management</span>
              </Link>
              <Link 
                href="/about" 
                className={mobileNavClasses("/about")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">About Me</span>
              </Link>
              {session && (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    signOut()
                  }}
                  className="w-full btn-material flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}