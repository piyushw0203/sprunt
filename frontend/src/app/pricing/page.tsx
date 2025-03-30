import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Pricing() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Pricing Header */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Choose the Plan That’s Right for You
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Flexible pricing plans to fit the needs of your team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Plan</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• AI-driven daily standups</li>
                <li>• Task automation for one project</li>
                <li>• Basic code review & documentation</li>
                <li>• Up to 5 users</li>
                <li>• Email support</li>
              </ul>
              <p className="mt-4 text-2xl font-bold text-gray-900">$29/month</p>
            </div>

            {/* Team Plan */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Team Plan</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Everything in Basic Plan</li>
                <li>• Unlimited tasks & sprints</li>
                <li>• AI-powered analytics & insights</li>
                <li>• Code review with suggestions</li>
                <li>• Up to 50 users</li>
                <li>• Priority email support</li>
              </ul>
              <p className="mt-4 text-2xl font-bold text-gray-900">$79/month</p>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Plan</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Everything in Team Plan</li>
                <li>• Dedicated AI-powered insights</li>
                <li>• Customizable dashboards</li>
                <li>• 24/7 premium support</li>
                <li>• White-label solution</li>
                <li>• Up to 500 users</li>
              </ul>
              <p className="mt-4 text-2xl font-bold text-gray-900">Contact for pricing</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mt-6 text-lg leading-8 text-indigo-200">
            Start using Sprunt today and let AI take care of your agile ceremonies while you focus on building great software.
          </p>
          <Link
            href="/demo"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Schedule a Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
