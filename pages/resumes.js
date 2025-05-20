import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Search, ExternalLink, FileText, CheckCircle2, Clock, Plus } from 'lucide-react';
import Layout from '../components/Layout';
// Import Redux hooks and actions
import { useSelector, useDispatch } from 'react-redux';
import { setResumeList, resetResumeListUpdateFlag } from '@/store/slices/resumeSlice';

const Resumes = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    // Use local state for UI-specific states
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [activeProfileId, setActiveProfileId] = useState(null);

    // Get resume list from Redux store
    const { resumeList: profiles, isResumeListUpdated } = useSelector(state => state.resume);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-resume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profiles');

            const data = await response.json();
            if (data && Array.isArray(data.data)) {
                // Store the resume list in Redux instead of local state
                dispatch(setResumeList(data.data));
            } else {
                dispatch(setResumeList([]));
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
            dispatch(setResumeList([]));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [dispatch]);

    // Add a new useEffect to check for resume list updates
    useEffect(() => {
        // If the resume list has been updated (e.g., after saving a resume)
        if (isResumeListUpdated) {
            // Fetch the updated resume list
            fetchProfiles();
            // Reset the update flag to prevent unnecessary refreshes
            dispatch(resetResumeListUpdateFlag());
        }
    }, [isResumeListUpdated, dispatch]);

    const handleActiveResume = (profile) => {
        localStorage.setItem('profileData', JSON.stringify(profile));
        setActiveProfileId(profile.id);
    };

    const filteredProfiles = profiles
        .filter(profile =>
            `${profile.first_name} ${profile.last_name}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen pt-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-2 text-teal-600">
                                <div className="w-3 h-3 rounded-full animate-pulse bg-teal-600"></div>
                                <div className="w-3 h-3 rounded-full animate-pulse bg-teal-600 delay-75"></div>
                                <div className="w-3 h-3 rounded-full animate-pulse bg-teal-600 delay-150"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const ResumeCard = ({ profile }) => (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="relative w-full h-48 bg-gray-100">
                <Image
                    src={`/templates/${profile.template_id || 'modern'}.png`}
                    alt="Resume preview"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        {activeProfileId === profile.id ? (
                            <div className="flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-teal-600 mr-2" />
                                <span className="text-xs font-medium text-teal-600 px-2 py-0.5 bg-teal-50 rounded-full">
                                    Active
                                </span>
                            </div>
                        ) : (
                            <span className="w-3 h-3 bg-gray-200 rounded-full mr-2" />
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                    {profile.first_name} {profile.last_name}
                </h3>

                {profile.job_title && (
                    <p className="mt-1 text-sm text-gray-600">{profile.job_title}</p>
                )}

                <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Updated {formatDate(profile.updated_at)}</span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={`/builder?userProfileId=${profile.id}`}
                        onClick={() => handleActiveResume(profile)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-200"
                    >
                        Use Resume
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage and edit all your professional resumes in one place
                                </p>
                            </div>
                            <Link
                                href="/builder?templateId=modern"
                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Resume
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search your resumes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="date">Sort by Last Updated</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProfiles.map((profile) => (
                            <ResumeCard
                                key={profile.id}
                                profile={profile}
                            />
                        ))}
                    </div>

                    {filteredProfiles.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="flex flex-col items-center">
                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first resume.'}
                                </p>
                                {!searchTerm && (
                                    <Link
                                        href="/builder?templateId=modern"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Resume
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Resumes;