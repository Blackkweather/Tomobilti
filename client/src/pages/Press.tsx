import React from 'react';

const Press: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, press releases, and media coverage about ShareWheelz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Press Releases</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ShareWheelz Launches Revolutionary Car Sharing Platform
                </h3>
                <p className="text-gray-600 text-sm mb-2">March 15, 2024</p>
                <p className="text-gray-600">
                  New platform connects car owners with renters, promoting sustainable transportation...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read More →</a>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Partnership with Major Automotive Brands Announced
                </h3>
                <p className="text-gray-600 text-sm mb-2">February 28, 2024</p>
                <p className="text-gray-600">
                  Strategic partnerships bring premium vehicles to the sharing economy...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read More →</a>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ShareWheelz Expands to 10 New Cities
                </h3>
                <p className="text-gray-600 text-sm mb-2">January 10, 2024</p>
                <p className="text-gray-600">
                  Rapid expansion brings car sharing services to more communities nationwide...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read More →</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Coverage</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  "The Future of Transportation" - TechCrunch
                </h3>
                <p className="text-gray-600 text-sm mb-2">March 20, 2024</p>
                <p className="text-gray-600">
                  ShareWheelz is revolutionizing how we think about car ownership and sharing...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read Article →</a>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  "Sustainable Mobility Solutions" - Forbes
                </h3>
                <p className="text-gray-600 text-sm mb-2">March 5, 2024</p>
                <p className="text-gray-600">
                  How ShareWheelz is contributing to a more sustainable future...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read Article →</a>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  "Innovation in Car Sharing" - Wired
                </h3>
                <p className="text-gray-600 text-sm mb-2">February 15, 2024</p>
                <p className="text-gray-600">
                  The technology behind ShareWheelz's smart matching system...
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Read Article →</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Kit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <svg className="w-12 h-12 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Logo Assets</h3>
              <p className="text-gray-600 text-sm mb-4">High-resolution logos in various formats</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Download
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <svg className="w-12 h-12 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Press Kit</h3>
              <p className="text-gray-600 text-sm mb-4">Company information and key facts</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Download
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <svg className="w-12 h-12 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Images</h3>
              <p className="text-gray-600 text-sm mb-4">High-quality product and lifestyle photos</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Our Press Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Press Inquiries</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Brahim El Kettani</p>
                  <p className="text-gray-600">CEO, CFO & Founder</p>
                  <p className="text-blue-600">admin@sharewheelz.uk</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mohammed Henna</p>
                  <p className="text-gray-600">CTO, COO & Founder</p>
                  <p className="text-blue-600">management@sharewheelz.uk</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Olivia V</p>
                  <p className="text-gray-600">CCO & CMO</p>
                  <p className="text-blue-600">admin@sharewheelz.uk</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Media Contact</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> +44 20 7946 0958
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> press@sharewheelz.uk
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span><br />
                  123 Oxford Street<br />
                  London, W1D 2HG<br />
                  United Kingdom
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
