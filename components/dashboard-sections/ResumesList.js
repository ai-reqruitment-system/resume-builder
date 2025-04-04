import { Clock, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';


export default function ResumesList({ profiles, isLoading, activeProfileId, handleActiveResume, handleDeleteResume, isDeleting }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-2 sm:px-0">
            {/* New Resume Card */}
            <div
                onClick={() => handleActiveResume({})}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50/30 group cursor-pointer h-[350px] sm:h-[400px] md:h-[480px]"
            >
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <h3 className="text-2xl font-semibold text-gray-700">+</h3>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">New Resume</h3>
                    <p className="text-gray-600 max-w-sm text-sm leading-relaxed">
                        Create a tailored resume for each job application. Double your chances of getting hired!
                    </p>
                </div>
                <button className="px-6 py-2.5 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors duration-200 font-medium shadow-sm hover:shadow group-hover:scale-105">
                    Create New
                </button>
            </div>

            {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
                </div>
            ) : (
                profiles.map((profile) => (
                    <div
                        key={profile.id}
                        onClick={() => handleActiveResume(profile)}
                        className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-[350px] sm:h-[400px] md:h-[480px] ${activeProfileId === profile.id ? 'ring-2 ring-teal-300' : ''}`}
                    >
                        <div className="relative w-full h-32 sm:h-40 md:h-45 bg-teal-300 flex justify-center items-center">
                            <h1 className='text-2xl font-bold text-gray-900 capitalize'>{profile.first_name}</h1>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    {activeProfileId === profile.id ? (
                                        <div className="flex items-center">
                                            <CheckCircle2 className="h-5 w-5 text-teal-400 mr-2" />
                                            <span className="text-xs font-medium text-black px-2 py-0.5 bg-teal-200 rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="w-3 h-3 bg-gray-200 rounded-full mr-2" />
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700">{`${profile.first_name} ${profile.last_name}`}</h3>
                            <p className="mt-1 text-sm text-gray-700">{profile.occupation || 'Untitled'}</p>

                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Updated {formatDate(profile.updated_at)}</span>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <button
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-teal-300 rounded-lg hover:bg-teal-200 transition-colors duration-200"
                                >
                                    Use Resume
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteResume(profile.id, e)}
                                    disabled={isDeleting}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-lg hover:bg-red-200 transition-colors duration-200 relative z-10 shadow-sm hover:shadow-md"
                                    title="Delete Resume"
                                >
                                    {isDeleting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    ) : (
                                        <>
                                            <Trash2 className="h-5 w-5" />
                                            <span className="ml-1">Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}