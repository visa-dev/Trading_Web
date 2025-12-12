"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-gray-200 px-4 py-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          PRIVACY POLICY FOR ATHENS TRADING
        </h1>

        <p className="text-gray-400 text-center">
          <b>Effective Date:</b> December 11, 2025 <br />
          <b>Last Updated:</b> December 11, 2025
        </p>

        <div className="my-6 border-t border-gray-700"></div>

        <Section title="1. INFORMATION WE COLLECT">
          <SubTitle>Device Information:</SubTitle>
          <List items={[
            "Device tokens for push notifications",
            "Device type and operating system version",
            "App version and usage statistics",
          ]} />

          <SubTitle>User Preferences:</SubTitle>
          <List items={[
            "Notification settings",
            "Trading signal preferences",
            "App configuration settings",
          ]} />

          <SubTitle>Usage Data:</SubTitle>
          <List items={[
            "App interaction data",
            "Notification delivery status",
            "Session duration and frequency",
          ]} />

          <SubTitle>We DO NOT collect:</SubTitle>
          <List items={[
            "Personal identification information (name, email, phone)",
            "Financial account information",
            "Location data",
            "Contact lists",
            "Camera or microphone access",
            "Any personally identifiable information",
          ]} icon="❌" />
        </Section>

        <Section title="2. HOW WE USE YOUR INFORMATION">
          <List items={[
            "Sending real-time gold trading signals via push notifications",
            "Providing trade management features and active trade monitoring",
            "Displaying trade history and analytics",
            "Improving app functionality and user experience",
            "Analyzing app performance",
            "Sending important app updates",
          ]} />
        </Section>

        <Section title="3. DATA SHARING AND DISCLOSURE">
          <p>We DO NOT sell, trade, or rent your information.</p>

          <SubTitle>Firebase (Google):</SubTitle>
          <List items={[
            "Used for push notification delivery",
            "Device tokens shared with Firebase Cloud Messaging",
            "Subject to Google's Privacy Policy",
          ]} />

          <SubTitle>API Server:</SubTitle>
          <List items={[
            "Secure processing of signals",
            "HTTPS encrypted",
            "No personal data stored",
          ]} />

          <p className="mt-3">
            We may disclose information only when required by law, to prevent fraud, 
            or to protect user safety.
          </p>
        </Section>

        <Section title="4. DATA SECURITY">
          <List items={[
            "HTTPS encryption",
            "Secure API authentication",
            "Regular security updates",
            "Minimal data collection",
            "No storage of personal/financial info",
          ]} />
          <p>No internet system can guarantee 100% security.</p>
        </Section>

        <Section title="5. DATA RETENTION">
          <List items={[
            "Device tokens: kept while app installed",
            "Preferences: stored while app installed",
            "Usage data: stored 90 days",
          ]} />

          <p className="mt-3">
            When you uninstall the app, all associated data is automatically removed.
          </p>
        </Section>

        <Section title="6. YOUR RIGHTS AND CHOICES">
          <List items={[
            "Disable notifications anytime",
            "Uninstall to delete all stored data",
            "Request details about stored data",
            "Stop using the app if you disagree with policy",
          ]} />
        </Section>

        <Section title="7. CHILDREN'S PRIVACY">
          <p>
            Athens Trading is NOT for users under 18.  
            We do not knowingly collect data from children.
          </p>
        </Section>

        <Section title="8. THIRD-PARTY SERVICES">
          <p>We use the following services:</p>
          <List items={[
            "Firebase Cloud Messaging – Push notifications",
          ]} />
          <p>Please review their privacy policies separately.</p>
        </Section>

        <Section title="9. INTERNATIONAL DATA TRANSFERS">
          <p>
            Your data may be stored outside your country.  
            We ensure appropriate safeguards are used.
          </p>
        </Section>

        <Section title="10. CHANGES TO THIS PRIVACY POLICY">
          <p>
            We may update the policy anytime.  
            Updates are effective after posting in the app.
          </p>
        </Section>

        <Section title="11. DISCLAIMER">
          <p className="font-semibold text-red-400">
            TRADING RISK DISCLAIMER:
          </p>
          <List items={[
            "We do NOT execute trades",
            "We do NOT manage accounts",
            "We do NOT guarantee profits",
            "We do NOT provide financial advice",
          ]} />
          <p className="mt-3">
            Trading involves risk. Only invest money you can afford to lose.
          </p>
        </Section>

        <Section title="12. CONTACT US">
          <p>Email: info@sahanakalanka.com</p>
          <p>Developer: Athens By Sahan</p>
          <p>Response Time: Within 48 hours</p>
        </Section>

        <Section title="13. LEGAL COMPLIANCE">
          <List items={[
            "Google Play Developer policies",
            "GDPR principles",
            "CCPA principles",
            "Other data protection laws",
          ]} />
        </Section>

        <Section title="SUMMARY">
          <List items={[
            "Minimal data collection",
            "No personal info collected",
            "Data encrypted",
            "Data deleted on uninstall",
            "We do NOT sell your data",
            "App is 18+",
            "Trading involves risk",
          ]} />
        </Section>

        <p className="text-gray-400 text-center mt-12">
          Last Updated: December 11, 2025 <br />
          Version: 1.0
        </p>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-10"
    >
      <h2 className="text-xl font-bold text-blue-400 mb-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-2">{children}</div>
    </motion.section>
  );
}

function SubTitle({ children }: any) {
  return <h3 className="font-semibold text-gray-100 mt-4">{children}</h3>;
}

function List({ items, icon = "•" }: any) {
  return (
    <ul className="list-none ml-3 space-y-1">
      {items.map((item: string, i: number) => (
        <li key={i} className="flex items-start">
          <span className="mr-2 text-blue-400">{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
