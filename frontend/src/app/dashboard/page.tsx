'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('standup');

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">Your intelligent agile automation hub</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('standup')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'standup'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Daily Standup
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Tasks & Sprints
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Daily Standup Tab */}
            {activeTab === 'standup' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Generated Daily Standup</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Progress</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">
                        Based on yesterday's commits and PRs, the team has made significant progress on the authentication system. 
                        The new OAuth implementation is 80% complete, with 3 PRs merged and 2 in review.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Blockers Detected</h3>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-red-700">
                        ⚠️ The CI pipeline is failing for the frontend tests. AI suggests checking the new React component tests.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Today's Focus</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-700">
                        Based on sprint goals and current progress, the team should focus on completing the OAuth implementation and fixing the failing tests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks & Sprints Tab */}
            {activeTab === 'tasks' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Task Management</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Current Sprint</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-500">Sprint 12 - Authentication System</span>
                        <span className="text-sm font-medium text-indigo-600">Progress: 65%</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">OAuth Implementation</span>
                          <span className="text-sm font-medium text-green-600">Completed</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">User Profile Management</span>
                          <span className="text-sm font-medium text-yellow-600">In Progress</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Verification</span>
                          <span className="text-sm font-medium text-gray-600">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Generated Tasks</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                        <span className="ml-3 text-sm text-gray-600">Fix failing frontend tests in CI pipeline</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                        <span className="ml-3 text-sm text-gray-600">Complete OAuth implementation documentation</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                        <span className="ml-3 text-sm text-gray-600">Review and merge pending PRs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights & Analytics</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Velocity</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Velocity Chart Placeholder</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bottleneck Analysis</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">
                        AI has identified that code review time is increasing. The average PR review time has gone up by 25% in the last sprint.
                        Consider implementing automated code review tools to improve efficiency.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Predictive Analytics</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">
                        Based on current velocity and backlog, the team is projected to complete the authentication system 2 days ahead of schedule.
                        However, the new feature request for social login might impact this timeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 