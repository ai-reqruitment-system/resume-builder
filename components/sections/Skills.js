<<<<<<< HEAD
import React from 'react';
import SkillsLanguagesEditor from '@/components/SkillsLanguagesEditor';

const Skills = ({ formData, updateFormData }) => {
    const handleSkillsChange = (skills) => {
        updateFormData('skill', skills.map(s => s.name));
    };

    const handleLanguagesChange = (languages) => {
        updateFormData('language', languages.map(l => l.name));
    };

    return (
        <div className="w-full space-y-6">
            <div className="space-y-8">
                {/* Skills Section */}
                <div className=" bg-white rounded-xl  space-y-4 transition-all duration-300">

                    <SkillsLanguagesEditor

                        value={formData.skill ? formData.skill.map(skill => ({ name: skill, proficiency: 'Intermediate' })) : []}
                        onChange={handleSkillsChange}
                        title="Skills"
                        type="skills"
                        customPrompt="Provide a comprehensive list of professional skills related to:"
                    />
                </div>

                {/* Languages Section */}
                <div className=" space-y-4 transition-all duration-300">

                    <SkillsLanguagesEditor
                        value={formData.language ? formData.language.map(lang => ({ name: lang, proficiency: 'Intermediate' })) : []}
                        onChange={handleLanguagesChange}
                        title="Languages"
                        type="languages"
                        customPrompt="Provide a list of languages only like Hindi,bengali,marathi,spanish,german etc. "
                    />
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

const Skills = ({ formData, updateFormData }) => {
    // State for skills
    const [searchSkills, setSearchSkills] = useState('');
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(formData.skill || []);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [errorSkills, setErrorSkills] = useState(null);

    // State for languages
    const [languages] = useState([
        "English", "Hindi", "Gujarati", "Marathi", "Tamil",
        "Bengali", "Arabic", "Spanish", "French", "German"
    ]);
    const [searchLanguages, setSearchLanguages] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState(formData.language || []);

    // Debounced function to fetch skills from OpenAI API
    const fetchSkills = debounce(async (searchTerm) => {
        if (searchTerm.length >= 3) { // Only search if the term is meaningful
            try {
                setLoadingSkills(true);
                setErrorSkills(null);

                const response = await axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: `Provide a list of technical skills related to: ${searchTerm}. 
                                Format the response as a comma-separated list and include search title also. Do not include numbers or bullet points.`,
                            },
                            {
                                role: "user",
                                content: `List technical skills related to: ${searchTerm}  and include search title also. 
                                Provide only a comma-separated list of skills.`,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Parse the API response
                const skillsText = response.data.choices[0].message.content;
                const skillsArray = skillsText
                    .split(',') // Split by commas
                    .map(skill => skill.trim()) // Trim whitespace
                    .filter(skill => skill.length > 0); // Remove empty strings

                setSuggestedSkills(skillsArray);
            } catch (err) {
                setErrorSkills("Failed to load skills. Please try again.");
                setSuggestedSkills([]);
            } finally {
                setLoadingSkills(false);
            }
        } else {
            setSuggestedSkills([]); // Clear suggestions if the search term is too short
        }
    }, 500); // Debounce for 500ms

    // Handle skill search input
    const handleSkillSearch = (searchTerm) => {
        setSearchSkills(searchTerm);
        fetchSkills(searchTerm);
    };

    // Handle skill selection
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

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 transition-all duration-300 hover:shadow-md">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Skills & Languages</h2>
                <p className="text-gray-500 text-sm">Add your key skills and languages to showcase your expertise.</p>
            </div>

            <div className="space-y-8">
                {/* Skills Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchSkills}
                            onChange={(e) => handleSkillSearch(e.target.value)}
                            placeholder="Type to search for skills (e.g., web development)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        />
                        {loadingSkills && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            </div>
                        )}
                    </div>
                    {errorSkills && (
                        <p className="text-sm text-red-500 mt-2">{errorSkills}</p>
                    )}

                    {/* Suggested Skills */}
                    {suggestedSkills.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                            {suggestedSkills.map((skill, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSkillSelect(skill)}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-all duration-300"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Skills */}
                    {selectedSkills.length > 0 && (
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-100"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => handleSkillRemove(skill)}
                                            className="hover:text-blue-900"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Languages Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchLanguages}
                            onChange={(e) => setSearchLanguages(e.target.value)}
                            placeholder="Type to search for languages"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        />
                    </div>

                    {/* Suggested Languages */}
                    {searchLanguages.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                            {languages
                                .filter(lang => lang.toLowerCase().includes(searchLanguages.toLowerCase()))
                                .map((lang, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-all duration-300"
                                    >
                                        {lang}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Selected Languages */}
                    {selectedLanguages.length > 0 && (
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {selectedLanguages.map((lang, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-green-100"
                                    >
                                        {lang}
                                        <button
                                            onClick={() => handleLanguageRemove(lang)}
                                            className="hover:text-green-900"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                </div>
            </div>
        </div>
    );
};

export default Skills;