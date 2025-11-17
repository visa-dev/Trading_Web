"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, TrendingUp, Shield, Zap, Eye, ArrowRight } from "lucide-react";

interface AdvancedIndicatorsProps {}

export const AdvancedIndicators: FC<AdvancedIndicatorsProps> = () => {
  return (
    <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="max-w-7xl mx-auto container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Premium Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-4">
            Advanced Trading
            <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Indicators & Systems
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Professional-grade indicators combining ICT methodology with Smart Money Concepts for institutional-level analysis
          </p>
        </motion.div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* ICT + Smart Money Confluence Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="card-material p-8 h-full bg-slate-800/20 border border-slate-700/40 hover:border-yellow-400/50 transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-medium text-yellow-300 mb-2">
                      🎯 ADVANCED ICT + SMART MONEY
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                      Confluence Indicator
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                This indicator combines Inner Circle Trader (ICT) concepts with Smart Money theory to deliver high-
                probability trading signals based on institutional order flow and market structure.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>ICT Market Structure Analysis</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Smart Money Order Flow Detection</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>High-Probability Confluence Signals</span>
                </div>
              </div>

              <motion.a
                href="https://www.tradingview.com/script/nSBzB7qq-ATHENS-Gold-ICT-Smart-Money-Advanced-Signals/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 group/btn shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold">View on TradingView</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Athens Gold Master System */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="card-material p-8 h-full bg-slate-800/20 border border-slate-700/40 hover:border-yellow-400/50 transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-medium text-yellow-300 mb-2">
                      🏆 PROFESSIONAL GOLD SYSTEM
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                      ATHENS GOLD MASTER v1.1e
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Professional Smart-Money-Based Gold Trading System built with institutional precision and ICT logic
                specifically designed for XAUUSD traders.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Specialized for XAUUSD Trading</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Institutional Precision Logic</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Smart Money Based Entries</span>
                </div>
              </div>

              <motion.a
                href="https://www.tradingview.com/script/ozH3KPIK-ATHENS-GOLD-MASTER-v1-1e-by-ATHENS/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 group/btn shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold">View Gold System</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Institutional Grade</h4>
            <p className="text-sm text-gray-400">Professional tools used by serious traders</p>
          </div>

          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Real-time Signals</h4>
            <p className="text-sm text-gray-400">Live market analysis and entry points</p>
          </div>

          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Market Confluence</h4>
            <p className="text-sm text-gray-400">Multiple confirmation factors for high probability</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
