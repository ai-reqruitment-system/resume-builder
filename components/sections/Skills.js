import React from 'react';
import SkillsSelector from '@/components/SkillsSelector';
import LanguagesSelector from '@/components/LanguagesSelector';

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

                    <SkillsSelector
                        value={formData.skill ? formData.skill.map(skill => ({ name: skill, proficiency: 'Intermediate' })) : []}
                        onChange={handleSkillsChange}
                        title="Skills"
                        customPrompt="Provide a comprehensive list of professional skills related to:"
                    />
                </div>

                {/* Languages Section */}
                <div className=" space-y-4 transition-all duration-300">

                    <LanguagesSelector
                        value={formData.language ? formData.language.map(lang => ({ name: lang, proficiency: 'Intermediate' })) : []}
                        onChange={handleLanguagesChange}
                        title="Languages"
                        customPrompt="Provide a list of languages only like Hindi,bengali,marathi,spanish,german etc. "
                    />
                </div>
            </div>
        </div>
    );
};


export default Skills;