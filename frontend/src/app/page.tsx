'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0"
            >
              <div>
                <div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/20"
                  >
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Eliminate Agile Waste. Let AI Handle Scrum.
                  </h2>
                  <p className="mt-4 text-lg text-blue-100">
                    Stop wasting time in endless meetings and story writing. Let AI handle your agile processes while you focus on what matters - building great software.
                  </p>
                  <div className="mt-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/demo"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-12 sm:mt-16 lg:mt-0"
            >
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <div className="w-full rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="w-full rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="/dashboard-preview.png"
                    alt="Dashboard preview"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h2 className="text-center text-4xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to eliminate Agile waste
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-slate-600">
              Our AI-powered platform handles all the agile ceremonies while you focus on coding
            </p>
          </motion.div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                AI-Driven Standups & Meetings
              </h3>
              <p className="mt-3 text-lg text-slate-600">
                Automated daily standups via Slack/Teams. AI-generated progress reports and automatic blocker detection.
              </p>
              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <p className="ml-16 text-lg leading-6 font-medium text-slate-900">Automated Daily Updates</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-slate-600">
                    AI automatically generates and posts daily updates based on your code commits and PRs.
                  </dd>
                </div>
                <div className="relative">
                  <dt>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </motion.div>
                    <p className="ml-16 text-lg leading-6 font-medium text-slate-900">Smart Progress Tracking</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-slate-600">
                    AI analyzes your codebase and automatically tracks progress, identifying potential blockers.
                  </dd>
                </div>
              </dl>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 -mx-4 relative lg:mt-0"
            >
              <div className="relative space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white p-6 rounded-xl shadow-lg border border-slate-100"
                >
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                    Task & Sprint Automation
                  </h3>
                  <p className="mt-3 text-lg text-slate-600">
                    AI-generated tasks, auto-prioritization, and sprint planning without meetings.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white p-6 rounded-xl shadow-lg border border-slate-100"
                >
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                    AI-Powered Code Review
                  </h3>
                  <p className="mt-3 text-lg text-slate-600">
                    Automated PR summaries, AI-assisted debugging, and documentation generation.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white p-6 rounded-xl shadow-lg border border-slate-100"
                >
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                    Smart Insights
                  </h3>
                  <p className="mt-3 text-lg text-slate-600">
                    AI-generated reports on team velocity, bottleneck detection, and automated retrospectives.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to eliminate Agile waste?</span>
              <span className="block">Start using Sprunt today.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Join the revolution in software development. Let AI handle the agile ceremonies while you focus on building great software.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 shadow-lg"
              >
                Schedule a Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
