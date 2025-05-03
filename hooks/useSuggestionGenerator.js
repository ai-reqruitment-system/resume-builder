import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

export const useSuggestionGenerator = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Create a ref to store the debounced function
    // This ensures it persists between renders
    const debouncedFetchRef = useRef(null);

    // Enhanced helper function to determine the appropriate prompt based on detailed context
    const getContextAwarePrompt = (title, customPrompt, contextInfo = {}) => {
        // If a custom prompt is provided, use it
        if (customPrompt) return customPrompt;

        // Extract context information
        const context = typeof contextInfo === 'string' ? contextInfo : (contextInfo.context || '');
        const currentContent = contextInfo.currentContent || '';
        const industry = contextInfo.industry || '';
        const experienceLevel = contextInfo.experienceLevel || '';
        const educationLevel = contextInfo.educationLevel || '';
        const jobFunction = contextInfo.jobFunction || '';
        const searchTerm = contextInfo.searchTerm || '';

        // Default prompts based on common resume sections with enhanced context awareness
        const lowerTitle = (title || '').toLowerCase();

        // Industry-specific modifier
        const industryModifier = industry ? `in the ${industry} industry` : '';

        // Experience level modifier
        const experienceLevelModifier = experienceLevel ? `for a ${experienceLevel}-level professional` : '';

        // Job function modifier
        const jobFunctionModifier = jobFunction ? `focusing on ${jobFunction} roles` : '';

        // Combine modifiers
        const contextModifiers = [industryModifier, experienceLevelModifier, jobFunctionModifier]
            .filter(modifier => modifier !== '')
            .join(' ');

        // Technical skills section prompts
        if (context === 'technical_skills' || (lowerTitle.includes('skill') && lowerTitle.includes('technical'))) {
            return `Generate a list of specific, in-demand technical skills for a ${title} professional ${contextModifiers}. Focus on hard skills, technologies, tools, and programming languages that are highly relevant and likely to pass ATS systems. List only the skill names without descriptions, separated by line breaks.`;
        }

        // Soft skills section prompts
        if (context === 'soft_skills' || (lowerTitle.includes('skill') && lowerTitle.includes('soft'))) {
            return `Generate a list of valuable soft skills and interpersonal abilities for a ${title} professional ${contextModifiers}. Focus on skills that demonstrate leadership, communication, and collaboration abilities. List only the skill names without descriptions, separated by line breaks.`;
        }

        // General skills section prompts
        if (lowerTitle.includes('skill') || context === 'skills') {
            return `Generate a list of specific, industry-relevant technical and soft skills for a ${title} professional ${contextModifiers}. Focus on skills that are in-demand and likely to pass ATS systems. List only the skill names without descriptions, separated by line breaks.`;
        }

        // Languages section prompts
        if (lowerTitle.includes('language') || context === 'languages') {
            return `List common languages that would be valuable for a ${title} professional ${contextModifiers}. Include only language names without descriptions.`;
        }

        // Senior experience section prompts
        if (context === 'senior_experience') {
            return `Generate 8-10 achievement-oriented bullet points for a senior-level ${title} role ${contextModifiers}. Focus on leadership accomplishments, strategic initiatives, and quantifiable results. Use powerful action verbs and highlight specific technologies or methodologies where relevant. Format as complete sentences ready to use in a resume.`;
        }

        // Junior experience section prompts
        if (context === 'junior_experience') {
            return `Generate 8-10 achievement-oriented bullet points for an entry-level or junior ${title} role ${contextModifiers}. Focus on learning experiences, technical skills applied, and contributions to projects. Use strong action verbs and highlight specific technologies or methodologies where relevant. Format as complete sentences ready to use in a resume.`;
        }

        // General experience section prompts
        if (lowerTitle.includes('experience') || lowerTitle.includes('job') || lowerTitle.includes('work') || context === 'experience') {
            return `Generate 8-10 achievement-oriented bullet points for a ${title} role ${contextModifiers}. Focus on quantifiable accomplishments, use strong action verbs, and highlight specific technologies or methodologies where relevant. Format as complete sentences ready to use in a resume.`;
        }

        // Advanced education section prompts
        if (context === 'advanced_education') {
            return `Generate 5-7 detailed descriptions of doctoral or advanced research achievements and specialized coursework for someone in the ${title} field ${contextModifiers}. Include specific academic accomplishments, publications, and research projects that demonstrate expertise.`;
        }

        // Graduate education section prompts
        if (context === 'graduate_education') {
            return `Generate 5-7 detailed descriptions of master's level educational achievements and relevant coursework for someone in the ${title} field ${contextModifiers}. Include specific academic accomplishments and projects that demonstrate advanced skills.`;
        }

        // General education section prompts
        if (lowerTitle.includes('education') || lowerTitle.includes('degree') || lowerTitle.includes('academic') || context === 'education') {
            return `Generate 5-7 detailed descriptions of educational achievements and relevant coursework for someone in the ${title} field ${contextModifiers}. Include specific academic accomplishments and projects that demonstrate relevant skills.`;
        }

        // Experienced professional summary prompts
        if (context === 'experienced_summary') {
            return `Create 5-7 compelling professional summary statements for an experienced ${title} professional ${contextModifiers}. Each summary should be 2-3 sentences long, highlight extensive experience, key accomplishments, and specialized expertise. Focus on leadership qualities, industry impact, and unique value proposition.`;
        }

        // Entry-level summary prompts
        if (context === 'entry_level_summary') {
            return `Create 5-7 compelling professional summary statements for an entry-level ${title} professional ${contextModifiers}. Each summary should be 2-3 sentences long, highlight educational background, internship experience, and emerging skills. Focus on enthusiasm, potential, and relevant qualifications.`;
        }

        // General summary/profile section prompts
        if (lowerTitle.includes('summary') || lowerTitle.includes('profile') || lowerTitle.includes('about') || context === 'summary') {
            return `Create 5-7 compelling professional summary statements for a ${title} professional ${contextModifiers}. Each summary should be 2-3 sentences long, highlight key qualifications, and be tailored to modern resume standards. Focus on experience level, key skills, and unique value proposition.`;
        }

        // Certifications section prompts
        if (lowerTitle.includes('certification') || lowerTitle.includes('certificate') || lowerTitle.includes('credential') || context === 'certifications') {
            return `List 8-10 relevant professional certifications for a ${title} professional ${contextModifiers}. Include only the official certification names that would strengthen a resume in this field.`;
        }

        // Projects section prompts
        if (lowerTitle.includes('project') || lowerTitle.includes('portfolio') || context === 'projects') {
            return `Generate 6-8 compelling project descriptions for a ${title} professional's portfolio ${contextModifiers}. Each description should highlight the project objective, technologies used, your role, and measurable outcomes. Format as complete sentences ready to use in a resume.`;
        }

        // Achievements section prompts
        if (lowerTitle.includes('achievement') || lowerTitle.includes('award') || context === 'achievements') {
            return `Generate 5-7 impressive professional achievements or awards for a ${title} professional ${contextModifiers}. Focus on recognition, measurable impact, and competitive distinctions. Format as complete sentences ready to use in a resume.`;
        }

        // Volunteer work section prompts
        if (lowerTitle.includes('volunteer') || lowerTitle.includes('community') || context === 'volunteer_work') {
            return `Generate 4-6 meaningful volunteer experiences or community involvement descriptions for a ${title} professional ${contextModifiers}. Highlight transferable skills, leadership roles, and positive impact. Format as complete sentences ready to use in a resume.`;
        }

        // Publications section prompts
        if (lowerTitle.includes('publication') || lowerTitle.includes('research') || context === 'publications') {
            return `Generate 4-6 professional publication or research output descriptions for a ${title} professional ${contextModifiers}. Format in a bibliography style appropriate for a resume, highlighting your contribution and the publication's impact.`;
        }

        // References section prompts
        if (lowerTitle.includes('reference') || context === 'references') {
            return `Generate 3-5 examples of how to present professional references for a ${title} professional ${contextModifiers}. Include templates for how to format reference information appropriately on a resume or in a separate document.`;
        }

        // Search term specific prompt
        if (searchTerm) {
            return `Provide a comprehensive list of at least 8-10 detailed professional descriptions related to "${searchTerm}" in the context of ${title || 'a resume'} ${contextModifiers}. Make suggestions diverse, specific, and relevant to modern resume standards.`;
        }

        // Default prompt for general suggestions
        return `Provide a comprehensive list of at least 8-10 detailed professional descriptions for this job title or search term. Make suggestions diverse, specific, and relevant to modern resume standards for a ${title} position ${contextModifiers}.`;
    };

    // The actual API call function with enhanced context handling
    const fetchSuggestions = useCallback(async (title, customPrompt, contextInfo = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            // Get the context-aware prompt using the enhanced context information
            const contextAwarePrompt = getContextAwarePrompt(title, customPrompt, contextInfo);

            // Prepare a more detailed user message based on available context
            let userMessage = title || '';

            // If we have context information as an object, enhance the user message
            if (typeof contextInfo === 'object' && contextInfo !== null) {
                // Add search term if available
                if (contextInfo.searchTerm) {
                    userMessage = contextInfo.searchTerm;
                }

                // Add industry information if available
                if (contextInfo.industry) {
                    userMessage += ` in the ${contextInfo.industry} industry`;
                }

                // Add experience level if available
                if (contextInfo.experienceLevel) {
                    userMessage += ` for ${contextInfo.experienceLevel}-level positions`;
                }

                // Add job function if available
                if (contextInfo.jobFunction) {
                    userMessage += ` with focus on ${contextInfo.jobFunction} roles`;
                }
            }

            // Finalize the user message
            userMessage += `. Please provide at least 8-10 detailed and diverse suggestions that are specific to this field and highly relevant for a professional resume.`;

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: contextAwarePrompt,
                        },
                        {
                            role: "user",
                            content: userMessage
                        },
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const skillsData = response.data.choices[0].message.content
                .split("\n")
                .map(suggestion => suggestion.trim())
                .filter(suggestion => suggestion.length > 0)
                .map(suggestion => {
                    // Remove numerical prefixes like "1. ", "2. ", etc.
                    return suggestion.replace(/^\d+\.\s*/, '');
                });

            setSuggestions(skillsData);
            return skillsData; // Return the suggestions for optional external handling
        } catch (error) {
            console.error('Error generating suggestions:', error);
            setError('Failed to generate suggestions. Please try again.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initialize the debounced function once
    if (!debouncedFetchRef.current) {
        debouncedFetchRef.current = debounce((title, customPrompt, contextInfo) => {
            fetchSuggestions(title, customPrompt, contextInfo);
        }, 2000); // 2 seconds delay
    }

    // The public API that components will call
    const generateSuggestions = useCallback((title, customPrompt, contextInfo) => {
        // Clear previous suggestions and show loading state immediately
        setSuggestions([]);
        setIsLoading(true);

        // Use the debounced function
        debouncedFetchRef.current(title, customPrompt, contextInfo);
    }, []);


    // Memoize setSuggestions to avoid unnecessary re-renders
    const memoizedSetSuggestions = useCallback((data) => {
        setSuggestions(data);
    }, []);

    // Clean up the debounced function on unmount
    useCallback(() => {
        return () => {
            if (debouncedFetchRef.current && debouncedFetchRef.current.cancel) {
                debouncedFetchRef.current.cancel();
            }
        };
    }, []);

    return {
        suggestions,
        isLoading,
        searchTerm,
        setSearchTerm,
        generateSuggestions,
        setSuggestions: memoizedSetSuggestions
    };
};
