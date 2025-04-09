import React from 'react';
import { X } from 'lucide-react';

const JobDescription = ({ job, onClose }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 lg:sticky lg:top-8 overflow-hidden">
            {/* Header with close button */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-300"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(100vh-300px)] p-6">
                <div className="space-y-6">
                    {/* Job header information */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                        <div className="flex items-center text-gray-600">
                            <span className="text-sm">{job.location}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">{job.type}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Key Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {job.responsibilities.map((responsibility, index) => (
                                <li key={index} className="text-gray-600 leading-relaxed pl-2">
                                    {responsibility}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {job.requirements.map((requirement, index) => (
                                <li key={index} className="text-gray-600 leading-relaxed pl-2">
                                    {requirement}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer with action buttons */}
            <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white z-10">
                <div className="flex gap-4">
                    <button className="flex-1 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 font-medium shadow-sm hover:shadow transform hover:translate-y-[-1px]">
                        Apply Now
                    </button>
                    <button className="flex-1 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium">
                        Save Job
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;