import React, { useState } from 'react';
import { SearchIcon, LocationMarkerIcon } from '@heroicons/react/outline';

const JobsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  
  // Sample job data - replace with actual API call
  const jobs = [
    {
      id: 1,
      title: 'Senior Salesforce Developer',
      company: 'Network.com',
      location: 'Indore, Madhya Pradesh, India',
      postedDate: '1 day ago',
      type: 'Remote',
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'LogiQlink Technologies',
      location: 'Indore, Madhya Pradesh, India',
      postedDate: '1 day ago',
      type: 'Remote',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Job title or company"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <LocationMarkerIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200">Remote</button>
          <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200">Auto Apply</button>
          <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200">Posted anytime</button>
          <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200">25 miles</button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-blue-600 mt-1">{job.company}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <LocationMarkerIcon className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{job.postedDate}</span>
              <div className="space-x-2">
                <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Auto Apply
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSection;