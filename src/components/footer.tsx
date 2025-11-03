"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Mail, Phone, MapPin, Facebook, ArrowUp } from "lucide-react"
import { FaTiktok } from "react-icons/fa"
import { Button } from "@/components/ui/button"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    trading: [
      { name: "Performance", href: "/posts" },
      { name: "Videos", href: "/videos" },
      { name: "Analytics", href: "/analytics" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Reviews", href: "/reviews" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Risk Disclosure", href: "/risk" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/share/1CuHaE3Twp/", icon: Facebook },
    { name: "TikTok", href: "https://www.tiktok.com/@saas.me?fbclid=IwVERDUANwbaVleHRuA2FlbQIxMAABHleOtY_nuEn_8tcyR-EbRMVTRpiPg8Be71MKn9vZIO6cLcTbDzDohwBu-cJo_aem_rdWmRIcNKUlNcvLlF_AQog", icon: FaTiktok },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto container-responsive">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white font-heading gradient-text-gold">
                  Sahan Akalanka
                </span>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Professional trading performance tracking and analysis platform with AI-powered insights for the modern investor.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-3 text-yellow-400" />
                  <span>contact@sahanakalanka.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-3 text-yellow-400" />
                  <span>+94 77 638 7655</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-3 text-yellow-400" />
                  <span>Dubai, UAE</span>
                </div>
              </div>
            </motion.div>

            {/* Trading Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Trading</h3>
              <ul className="space-y-3">
                {footerLinks.trading.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-6 md:mb-0">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>

              <Button
                onClick={scrollToTop}
                className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 transition-all duration-300"
                size="sm"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="py-6 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Sahan Akalanka Trading Platform. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Powered insights and professional trading expertise.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
