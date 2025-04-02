import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Features() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Features Header */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                AI-Powered Agile Automation
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Eliminate Agile waste with intelligent automation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* AI-Driven Standups */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Driven Standups</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Automated daily updates via Slack/Teams</li>
                <li>• AI-generated progress reports</li>
                <li>• Automatic blocker detection</li>
                <li>• Smart task tracking</li>
              </ul>
            </div>

            {/* Task & Sprint Automation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Task & Sprint Automation</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• AI-generated Jira/GitHub tasks</li>
                <li>• Auto-prioritization of work</li>
                <li>• Sprint planning without meetings</li>
                <li>• Smart backlog management</li>
              </ul>
            </div>

            {/* Code Review & Documentation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Code Review & Documentation</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Auto-generated PR summaries</li>
                <li>• AI-assisted debugging</li>
                <li>• Automated documentation</li>
                <li>• Code quality insights</li>
              </ul>
            </div>

            {/* AI Insights & Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Insights & Analytics</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Team velocity tracking</li>
                <li>• Bottleneck detection</li>
                <li>• Automated retrospectives</li>
                <li>• Predictive analytics</li>
              </ul>
            </div>

            {/* Integration Hub */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integration Hub</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• GitHub/GitLab integration</li>
                <li>• Jira/Azure DevOps sync</li>
                <li>• Slack/Teams notifications</li>
                <li>• Custom webhook support</li>
              </ul>
            </div>

            {/* AI-Powered Planning */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Planning</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Smart sprint planning</li>
                <li>• Resource optimization</li>
                <li>• Risk assessment</li>
                <li>• Timeline predictions</li>
              </ul>
            </div>

            {/* Discord Voice Transcription */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discord Voice Transcription</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time voice transcription</li>
                <li>• Automatic meeting summaries</li>
                <li>• Searchable conversation history</li>
                <li>• Easy access to past discussions</li>
              </ul>
              <Link
                href="/transcriptions"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Transcriptions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your workflow?</span>
            <span className="block">Start using Sprunt today.</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-indigo-200">
            Join the revolution in software development. Let AI handle the agile ceremonies while you focus on building great software.
          </p>
          <div className="mt-8 space-x-4">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/transcriptions"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600"
            >
              View Transcriptions
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 