import React, { useState, useEffect } from 'react';
import { X, Loader2, Search, Plus } from 'lucide-react';
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import EnhancedTipTapEditor from '../enhancedtiptapeditor';

const SkillsEnhanced = ({ formData, updateFormData }) => {
    // State for skills
    const [searchSkills, setSearchSkills] = useState('');
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(formData.skill || []);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [errorSkills, setErrorSkills] = useState(null);

    // State for languages - hardcoded list only, no AI generation
    const [languages] = useState([
        "English", "Hindi", "Gujarati", "Marathi", "Tamil",
        "Bengali", "Arabic", "Spanish", "French", "German"
    ]);
    const [searchLanguages, setSearchLanguages] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState(formData.language || []);

    // Common skill description suggestions
    const skillSuggestions = [
        "Proficient in JavaScript and modern frameworks",
        "Experienced with React.js and Next.js",
        "Strong knowledge of HTML5 and CSS3",
        "Familiar with backend technologies like Node.js",
        "Database design and management skills",
        "Excellent problem-solving abilities",
        "Effective communication and teamwork",
        "Project management and organization",
        "UI/UX design principles",
        "Responsive web design techniques",
        "Version control with Git",
        "Testing and debugging expertise",
        "Performance optimization strategies",
        "API integration experience",
        "Agile development methodologies"
    ];

    const handleSkillSelect = (skill) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
        setSearchSkills(''); // Clear the search input
    };

    // Handle skill removal
    const handleSkillRemove = (skill) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
    };

    // Handle language selection
    const handleLanguageSelect = (language) => {
        if (!selectedLanguages.includes(language)) {
            setSelectedLanguages([...selectedLanguages, language]);
        }
        setSearchLanguages(''); // Clear the search input
    };

    // Handle language removal
    const handleLanguageRemove = (language) => {
        setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    };

    // Update form data when selected skills or languages change
    useEffect(() => {
        updateFormData('skill', selectedSkills);
    }, [selectedSkills]);

    useEffect(() => {
        updateFormData('language', selectedLanguages);
    }, [selectedLanguages]);

    // Handle skill description suggestions
    const handleSuggestionClick = (suggestion) => {
        const currentContent = formData.skill_description || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        if (!currentContent) {
            updateFormData('skill_description', bulletPoint);
        } else if (currentContent.includes('</ul>')) {
            const newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
            updateFormData('skill_description', newContent);
        } else {
            updateFormData('skill_description', currentContent + bulletPoint);
        }
    };

    const isSuggestionSelected = (suggestion) => {
        const currentContent = formData.skill_description || '';
        return currentContent.includes(suggestion);
    };

    // Combined view with both skills selection and description editor
    return (
        <div className="w-full space-y-5">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Skills & Languages</h2>
                <p className="text-gray-500 text-sm">Add your key skills and languages to showcase your expertise.</p>
            </div>

            <div className="space-y-5">
                {/* Skills Section */}
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                    <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Skills</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchSkills}
                            onChange={(e) => setSearchSkills(e.target.value)}
                            placeholder="Type to search for skills (e.g., web development)"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                        />
                        {loadingSkills && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <Loader2 className="h-5 w-5 text-teal-500 animate-spin" />
                            </div>
                        )}
                    </div>
                    {errorSkills && (
                        <p className="text-sm text-red-500 mt-1">{errorSkills}</p>
                    )}

                    {/* Suggested Skills */}
                    {searchSkills.length > 0 && (
                        <div className="mt-2 max-h-36 overflow-y-auto border border-gray-200 rounded-lg">
                            {skillSuggestions
                                .filter(skill => skill.toLowerCase().includes(searchSkills.toLowerCase()))
                                .map((skill, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSkillSelect(skill)}
                                        className="cursor-pointer px-3 py-1.5 hover:bg-gray-50 text-sm text-gray-700 transition-all duration-300"
                                    >
                                        {skill}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Selected Skills */}
                    {selectedSkills.length > 0 && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-1.5">
                                {selectedSkills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-teal-100"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => handleSkillRemove(skill)}
                                            className="hover:text-teal-900 ml-0.5"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Languages Section */}
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                    <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Languages</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchLanguages}
                            onChange={(e) => setSearchLanguages(e.target.value)}
                            placeholder="Type to search for languages"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                        />
                    </div>

                    {/* Suggested Languages */}
                    {searchLanguages.length > 0 && (
                        <div className="mt-2 max-h-36 overflow-y-auto border border-gray-200 rounded-lg">
                            {languages
                                .filter(lang => lang.toLowerCase().includes(searchLanguages.toLowerCase()))
                                .map((lang, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="cursor-pointer px-3 py-1.5 hover:bg-gray-50 text-sm text-gray-700 transition-all duration-300"
                                    >
                                        {lang}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Selected Languages */}
                    {selectedLanguages.length > 0 && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-1.5">
                                {selectedLanguages.map((lang, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-teal-100"
                                    >
                                        {lang}
                                        <button
                                            onClick={() => handleLanguageRemove(lang)}
                                            className="hover:text-teal-900 ml-0.5"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Skills Description Section */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Skills Description</h3>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Technical Expertise</h2>
                    <p className="text-gray-500 text-sm">Add detailed descriptions of your skills and expertise</p>
                </div>

                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                    <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Technical Expertise</h3>

                    <EnhancedDescriptionEditor
                        value={formData.skill_description || ''}
                        onChange={(e) => updateFormData('skill_description', e.target.value)}
                        title="Skills Description"
                        customPrompt="Provide detailed descriptions of your technical skills and expertise:"
                        suggestions={skillSuggestions}
                        onSuggestionClick={handleSuggestionClick}
                        isSuggestionSelected={isSuggestionSelected}
                        showWritingAssistant={true}
                    />
                </div>
            </div>

            {/* Skills Description Section */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Skills Description</h3>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Technical Expertise</h2>
                    <p className="text-gray-500 text-sm">Add detailed descriptions of your skills and expertise</p>
                </div>

                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-300">
                    <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-3 mb-1">Technical Expertise</h3>

                    <EnhancedTipTapEditor
                        value={formData.skill_description || ''}
                        onChange={(e) => updateFormData('skill_description', e.target.value)}
                        title="Skills Description"
                        customPrompt="Provide detailed descriptions of your technical skills and expertise:"
                        suggestions={skillSuggestions}
                        onSuggestionClick={handleSuggestionClick}
                        isSuggestionSelected={isSuggestionSelected}
                        showWritingAssistant={true}
                    />
                </div>
            </div>

        </div >
    );
};

export default SkillsEnhanced;