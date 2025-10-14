import React from 'react';

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of the future of car sharing. We're looking for passionate individuals 
            to help us revolutionize how people access and share vehicles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Software Engineer</h3>
            <p className="text-gray-600 mb-4">
              Help us build the next generation of car sharing technology with React, Node.js, and modern web technologies.
            </p>
            <div className="text-sm text-gray-500 mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">Full-time</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full">Remote</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Manager</h3>
            <p className="text-gray-600 mb-4">
              Drive product strategy and work with cross-functional teams to deliver exceptional user experiences.
            </p>
            <div className="text-sm text-gray-500 mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">Full-time</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full">Hybrid</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Success</h3>
            <p className="text-gray-600 mb-4">
              Help our users have amazing experiences and grow our community of car owners and renters.
            </p>
            <div className="text-sm text-gray-500 mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">Full-time</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full">Remote</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Values</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Innovation and creativity</li>
                <li>• User-centric approach</li>
                <li>• Sustainability focus</li>
                <li>• Collaborative environment</li>
                <li>• Continuous learning</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Competitive salary and equity</li>
                <li>• Health and dental insurance</li>
                <li>• Flexible working hours</li>
                <li>• Professional development budget</li>
                <li>• Team building activities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't See Your Role?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute.
          </p>
          <button className="bg-gray-800 text-white py-3 px-8 rounded-md hover:bg-gray-900 transition-colors">
            Send Us Your Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
