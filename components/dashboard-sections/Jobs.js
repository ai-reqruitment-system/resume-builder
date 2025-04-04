import React, { useState } from 'react';
import { Search, MapPin, Heart, X, ArrowLeft } from 'lucide-react';
import JobDescription from './JobDescription';

const Jobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    // Sample job data - replace with actual API call
    const jobs = [
        {
            id: 1,
            title: 'Senior Salesforce Developer',
            company: 'Network.com',
            location: 'Indore, Madhya Pradesh, India',
            postedDate: '1 day ago',
            type: 'Remote',
            description: 'As a Salesforce Senior Developer, you will work within a Scrum team to enhance and maintain our Salesforce solutions across Service Cloud, Financial Services Cloud, Experience Cloud, and Chat, along with several integrated systems. You\'ll leverage your technical expertise to align platform capabilities with business needs, delivering features that directly impact business outcomes and customer value.',
            responsibilities: [
                'Develop and Enhance Salesforce Solutions using Apex, Lightning Components (Aura & LWC), Visualforce, Lightning Pages',
                'Work with Flow and Custom Metadata to meet business requirements',
                'Collaborate with cross-functional teams to deliver high-quality solutions',
                'Debug and resolve complex technical issues',
                'Mentor junior developers and conduct code reviews'
            ],
            requirements: [
                '5+ years of Salesforce development experience',
                'Strong expertise in Apex, Lightning Web Components, and Visualforce',
                'Experience with Salesforce integrations and APIs',
                'Salesforce certifications (Platform Developer I/II)',
                'Excellent problem-solving and communication skills'
            ]
        },
        {
            id: 2,
            title: 'Full Stack Engineer',
            company: 'LogiQlink Technologies',
            location: 'Indore, Madhya Pradesh, India',
            postedDate: '1 day ago',
            type: 'Remote',
            description: 'We are seeking a skilled Full Stack Engineer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies and best practices.',
            responsibilities: [
                'Design and implement scalable web applications',
                'Work with both frontend and backend technologies',
                'Optimize applications for maximum performance',
                'Write clean, maintainable, and efficient code',
                'Collaborate with team members on technical decisions'
            ],
            requirements: [
                '3+ years of full-stack development experience',
                'Proficiency in React.js, Node.js, and SQL/NoSQL databases',
                'Experience with cloud platforms (AWS/Azure/GCP)',
                'Strong understanding of web security principles',
                'Excellent problem-solving skills'
            ]
        },
    ];

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Section */}
            <div className={`bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-all duration-300 ${selectedJob ? 'lg:block hidden' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Job title or company"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all duration-300 hover:border-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all duration-300 hover:border-gray-300"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <MapPin className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" />
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium">
                        Remote
                    </button>
                    <button className="px-5 py-2.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium">
                        Auto Apply
                    </button>
                    <button className="px-5 py-2.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium">
                        Posted anytime
                    </button>
                </div>
            </div>

            {/* Job Listings and Description Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                {/* Job Listings */}
                <div className={`space-y-6 ${selectedJob ? 'lg:block hidden' : ''}`}>
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 group ${selectedJob?.id === job.id ? 'ring-2 ring-teal-400' : ''}`}
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                                        {job.title}
                                    </h3>
                                    <p className="text-teal-600 mt-1 font-medium">{job.company}</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 transform hover:scale-110">
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{job.location}</span>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                    {job.postedDate}
                                </span>
                                <div className="space-x-3">
                                    <button className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium">
                                        Auto Apply
                                    </button>
                                    <button className="px-4 py-2 text-sm bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-all duration-300 font-medium shadow-sm hover:shadow transform hover:translate-y-[-1px]">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Job Description Panel */}
                {selectedJob && (
                    <div className={`${selectedJob ? 'block' : 'hidden'} lg:block`}>
                        {/* Back button for mobile */}
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="lg:hidden flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Jobs
                        </button>
                        <JobDescription job={selectedJob} onClose={() => setSelectedJob(null)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;