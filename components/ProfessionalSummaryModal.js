import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Editor from "react-simple-wysiwyg";

const ProfessionalSummaryModal = ({ isOpen, onClose, value, onChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    // Add useEffect to automatically open dropdown when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    const templates = [
        {
            title: "Professional Summary",
            templates: [
                "Experienced professional with a proven track record in [field]. Skilled in [skill 1], [skill 2], and [skill 3]. Successfully delivered [achievement] resulting in [measurable outcome].",
                "Results-driven [job title] with [X] years of experience in [industry]. Demonstrated expertise in [key area] and [key area]. Achieved [specific achievement] through [action taken].",
                "Dynamic and detail-oriented [profession] specializing in [specialty area]. Proven ability to [key strength] and [key strength]. Led initiatives resulting in [positive outcome]."
            ]
        },
        {
            title: "Career Highlights",
            templates: [
                "Accomplished [job title] with expertise in [area]. Led cross-functional teams to deliver [project/initiative] with [X]% improvement in [metrics].",
                "Innovative [profession] recognized for [achievement]. Spearheaded [initiative] that resulted in [benefit/outcome]. Expertise includes [skill areas].",
                "Strategic [job role] with proven success in [industry sector]. Developed and implemented [strategy/solution] leading to [quantifiable result]."
            ]
        },
        {
            title: "Technical Background",
            templates: [
                "Technical [job title] with comprehensive knowledge of [technologies]. Implemented [technical solution] resulting in [improvement/benefit]. Proficient in [technical skills].",
                "Skilled [technical role] specializing in [technical area]. Developed [solution/system] that [benefit/outcome]. Expert in [technical competencies].",
                "Solution-focused [technical position] with expertise in [technical domain]. Successfully delivered [project] utilizing [technologies], resulting in [impact]."
            ]
        }
    ];

    const handleTemplateSelect = (template) => {
        onChange({ target: { value: template } });
        setIsDropdownOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Add Professional Summary</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Write your professional summary
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border
                                        border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2
                                        focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                                >
                                    Choose a Template
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                        {templates.map((category, idx) => (
                                            <div key={idx} className="border-b last:border-b-0">
                                                <div className="px-4 py-2 bg-gray-50">
                                                    <h4 className="font-medium text-sm text-gray-700">{category.title}</h4>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {category.templates.map((template, templateIdx) => (
                                                        <button
                                                            key={templateIdx}
                                                            onClick={() => handleTemplateSelect(template)}
                                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-teal-50
                                                                hover:text-teal-600 transition-colors"
                                                        >
                                                            {template}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            A good professional summary highlights your key achievements and skills
                        </p>
                        <div className="mt-2">
                            <Editor
                                value={value}
                                onChange={onChange}
                                className="w-full min-h-[300px] border border-gray-200 rounded-lg
                                    focus-within:ring-1 focus-within:ring-teal-500 focus-within:border-teal-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                            rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                            focus:ring-teal-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent
                            rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                            focus:ring-teal-500 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalSummaryModal;