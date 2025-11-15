"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Mail, Phone, ArrowUp, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SOCIAL_LINKS, BRAND_NAME, BRAND_TAGLINE, BRAND_EMAIL_ALTERNATIVE, BRAND_PHONE_DISPLAY, BRAND_PHONE_LINK, BRAND_WEBSITE, BUSINESS_HOURS } from "@/lib/constants"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    trading: [
      { name: "Performance", href: "/posts" },
      { name: "Videos", href: "/videos" },
      { name: "Account Management", href: "/account-management" },
      { name: "Copy Trading", href: "/copy-trading" },
    ],
    resources: [
      { name: "Academy", href: "/academy" },
      { name: "About", href: "/about" },
      { name: "Reviews", href: "/reviews" },
      { name: "Contact", href: "/contact" },
    ],
    external: [
      { name: "Athens SSL Website", href: BRAND_WEBSITE, external: true },
      { name: "MyFXBook Profile", href: "https://www.myfxbook.com/members/ATHENSbySAHAN", external: true },
    ],
  }

  // Use shared constants
  const socialLinks = SOCIAL_LINKS

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto container-responsive">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
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
                <span className="text-xl sm:text-2xl font-bold text-white font-heading gradient-text-gold">
                  {BRAND_NAME}
                </span>
              </div>
              
              <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">
                {BRAND_TAGLINE}
              </p>

              <div className="space-y-3 mb-4">
                <a 
                  href={`mailto:${BRAND_EMAIL_ALTERNATIVE}`}
                  className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 mr-3 text-yellow-400 flex-shrink-0" />
                  <span className="break-all">{BRAND_EMAIL_ALTERNATIVE}</span>
                </a>
                <a 
                  href={`tel:${BRAND_PHONE_LINK}`}
                  className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 mr-3 text-yellow-400 flex-shrink-0" />
                  <span>{BRAND_PHONE_DISPLAY}</span>
                </a>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-3 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{BUSINESS_HOURS}</span>
                </div>
              </div>

              <a
                href={BRAND_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm font-medium"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit {BRAND_NAME} Website
              </a>
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

            {/* Resources Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
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
              
              {/* External Links */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">External Links</h4>
                <ul className="space-y-2">
                  {footerLinks.external.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center text-sm"
                      >
                        {link.name}
                        <ArrowUp className="w-3 h-3 ml-1 rotate-45" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
              © {new Date().getFullYear()} {BRAND_NAME} Trading Platform. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Powered by{" "}
              <a 
                href="mailto:viraj.sachin.dev@gmail.com" 
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Viraj Sachin
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
