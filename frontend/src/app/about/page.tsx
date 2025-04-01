import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* About Header */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                About Sprunt
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Revolutionizing Agile with AI-Powered Automation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            At Sprunt, our mission is to enhance the way development teams work by integrating AI-powered tools that help eliminate wasteful agile practices. By automating daily tasks like standups, sprint planning, and code reviews, we enable teams to focus on what truly matters: building great software.
          </p>
          
          <h2 className="mt-12 text-2xl font-semibold text-gray-900">The Team</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">Piyush Waghulde</h3>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">Mahesh Sathe</h3>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">Atharva Shinde</h3>
            </div>
          </div>
          
          <h2 className="mt-12 text-2xl font-semibold text-gray-900">Join Our Team</h2>
          <p className="mt-4 text-lg text-gray-600">
            Interested in becoming part of our mission? Check out our <Link href="/careers" className="text-indigo-600">Careers Page</Link> for available positions.
          </p>
        </div>
      </div>
    </main>
  );
}
