"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, Clock, Send, User, MessageSquare, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { BRAND_NAME, BRAND_EMAIL, BRAND_PHONE_DISPLAY, BUSINESS_HOURS } from "@/lib/constants"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create mailto link
      const subject = encodeURIComponent(formData.subject)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )
      const mailtoLink = `mailto:${BRAND_EMAIL}?subject=${subject}&body=${body}`
      
      window.open(mailtoLink, '_blank')
      
      toast.success("Email client opened! Please send your message.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast.error("Failed to open email client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading gradient-text-gold mb-6 px-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Get in touch with {BRAND_NAME} for trading insights, questions, or collaboration opportunities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Trader Info Card */}
            <Card className="card-material">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white flex items-center flex-wrap gap-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  Trader Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SA</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{BRAND_NAME}</h3>
                    <p className="text-sm sm:text-base text-gray-400">Professional Trader & Mentor</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{BRAND_EMAIL}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{BRAND_PHONE_DISPLAY}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{BUSINESS_HOURS}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card className="card-material">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3 text-yellow-400" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => window.open(`mailto:${BRAND_EMAIL}`, '_blank')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Directly
                </Button>
                <Button
                  onClick={() => {
                    // Trigger floating chat
                    const chatButton = document.querySelector('[data-chat-trigger]') as HTMLElement;
                    if (chatButton) chatButton.click();
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="card-material">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">Quick Response</h3>
                    <p className="text-gray-400 text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="card-material">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Send className="w-6 h-6 mr-3 text-yellow-400" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-white">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-white">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="mt-1 bg-gray-800 border-gray-700 text-white resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-material"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="card-material">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Contact Us?
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Trading Questions</h3>
                  <p className="text-gray-400">Get expert advice on trading strategies and market analysis</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Mentorship</h3>
                  <p className="text-gray-400">Explore one-on-one coaching and personalized guidance</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
                  <p className="text-gray-400">Technical support and assistance with our services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
