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

    // Generate suggestions based on the provided context
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

    // Generate mock suggestions based on the context and title
    const generateMockSuggestions = (searchTerm, context, title = '') => {
        // Base suggestions that can work for most contexts
        const baseSuggestions = [
            "Developed and implemented innovative solutions that increased efficiency by 25%",
            "Collaborated with cross-functional teams to deliver high-quality results on time and within budget",
            "Managed multiple projects simultaneously while maintaining attention to detail and meeting all deadlines",
            "Conducted thorough research and analysis to identify opportunities for improvement",
            "Created comprehensive documentation and training materials for team members",
            "Presented findings and recommendations to senior management with clear, actionable insights",
            "Mentored junior team members, providing guidance and support for their professional development",
            "Streamlined processes to reduce operational costs while maintaining quality standards"
        ];

        // Context-specific suggestions
        const contextSuggestions = {
            'experience': [
                "Led a team of 5 professionals to successfully deliver a critical project ahead of schedule",
                "Increased department productivity by 30% through implementation of new workflows and tools",
                "Negotiated with vendors to reduce costs by 15% while improving service quality",
                "Resolved complex customer issues, maintaining a 98% satisfaction rating",
                "Pioneered new methodologies that became standard practice across the organization"
            ],
            'senior_experience': [
                "Directed strategic initiatives that resulted in $1.2M annual cost savings",
                "Led organizational transformation, aligning team objectives with company vision",
                "Managed a department budget of $5M, consistently meeting financial targets",
                "Developed and executed long-term strategic plans that increased market share by 15%",
                "Mentored and developed 12 direct reports, with 4 achieving promotions to leadership roles"
            ],
            'junior_experience': [
                "Assisted senior team members with research and data analysis for key projects",
                "Participated in training programs to develop essential skills and industry knowledge",
                "Contributed to team projects, taking responsibility for specific deliverables",
                "Learned and applied new technologies to improve workflow efficiency",
                "Received recognition for exceptional attention to detail and quality of work"
            ],
            'education': [
                "Achieved Dean's List recognition for academic excellence for 6 consecutive semesters",
                "Completed relevant coursework in advanced topics, maintaining a 3.8 GPA",
                "Participated in research project examining industry trends and future developments",
                "Selected for competitive academic program with a 15% acceptance rate",
                "Balanced full course load while working part-time and participating in extracurricular activities"
            ],
            'skills': [
                "Proficient in industry-standard software and tools with advanced certification",
                "Excellent problem-solving abilities with a track record of innovative solutions",
                "Strong analytical skills with experience in data-driven decision making",
                "Effective communication skills, both written and verbal, across all organizational levels",
                "Adaptable to changing priorities while maintaining focus on key objectives"
            ],
            'technical_skills': [
                "Expert in programming languages including Python, JavaScript, and SQL",
                "Experienced with cloud platforms (AWS, Azure) and containerization technologies",
                "Skilled in data analysis using statistical methods and visualization tools",
                "Proficient in project management methodologies including Agile and Scrum",
                "Knowledge of cybersecurity best practices and compliance requirements"
            ],
            'soft_skills': [
                "Exceptional interpersonal skills with ability to build strong professional relationships",
                "Demonstrated leadership in cross-functional team environments",
                "Excellent time management and organizational abilities",
                "Strong negotiation and conflict resolution capabilities",
                "Effective presentation and public speaking skills with executive audiences"
            ],
            'summary': [
                "Results-driven professional with 7+ years of experience delivering innovative solutions",
                "Detail-oriented team player with proven ability to optimize processes and increase efficiency",
                "Strategic thinker who consistently identifies opportunities for improvement and growth",
                "Dedicated professional committed to continuous learning and skill development",
                "Versatile team member adaptable to changing priorities and business needs"
            ],
            'certifications': [
                "Demonstrates comprehensive knowledge of industry best practices and standards",
                "Validates expertise in specialized techniques and methodologies",
                "Recognized credential that differentiates from peers in competitive job market",
                "Represents commitment to professional development and continuous learning",
                "Provides practical skills directly applicable to current industry challenges"
            ],
            'internship': [
                "Assisted in the development of key projects under senior team supervision",
                "Collaborated with cross-functional teams to deliver project components on schedule",
                "Conducted research and data analysis to support decision-making processes",
                "Participated in professional development workshops to enhance industry knowledge",
                "Received mentorship from experienced professionals in the field"
            ]
        };

        // Title-specific suggestions based on common job titles or education fields
        const titleSuggestions = {};

        // Generate title-specific suggestions if title is provided
        if (title && title.trim().length > 0) {
            const titleLower = title.toLowerCase();

            // Developer/Engineer suggestions
            if (titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('programming')) {
                titleSuggestions[titleLower] = [
                    `Developed and maintained ${titleLower.includes('front') ? 'user interfaces' : 'backend systems'} using modern technologies and best practices`,
                    `Implemented efficient code that improved application performance by 30%`,
                    `Collaborated with designers and product managers to deliver features that enhanced user experience`,
                    `Participated in code reviews to ensure quality and knowledge sharing across the team`,
                    `Debugged and resolved complex technical issues in production environments`
                ];
            }

            // Designer suggestions
            else if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) {
                titleSuggestions[titleLower] = [
                    `Created user-centered designs that increased user engagement by 40%`,
                    `Conducted user research and usability testing to inform design decisions`,
                    `Developed wireframes, prototypes, and high-fidelity mockups for web and mobile applications`,
                    `Collaborated with developers to ensure design implementation met quality standards`,
                    `Established design systems that improved consistency and development efficiency`
                ];
            }

            // Management suggestions
            else if (titleLower.includes('manager') || titleLower.includes('director') || titleLower.includes('lead')) {
                titleSuggestions[titleLower] = [
                    `Led a team of professionals to achieve quarterly targets consistently`,
                    `Developed strategic plans that aligned with organizational objectives`,
                    `Implemented process improvements that increased team productivity by 25%`,
                    `Managed budget and resources effectively, delivering projects under budget`,
                    `Mentored team members, resulting in improved performance and career advancement`
                ];
            }

            // Marketing suggestions
            else if (titleLower.includes('market') || titleLower.includes('brand') || titleLower.includes('content')) {
                titleSuggestions[titleLower] = [
                    `Developed marketing campaigns that increased customer acquisition by 35%`,
                    `Created content strategy that improved engagement across digital channels`,
                    `Analyzed market trends and competitor activities to inform strategic decisions`,
                    `Managed social media presence, growing follower base by 50% in six months`,
                    `Collaborated with sales team to develop materials that supported revenue growth`
                ];
            }

            // Education-specific suggestions
            else if (titleLower.includes('degree') || titleLower.includes('bachelor') || titleLower.includes('master') ||
                titleLower.includes('phd') || titleLower.includes('study')) {
                titleSuggestions[titleLower] = [
                    `Completed advanced coursework in ${title} with exceptional academic standing`,
                    `Conducted research project examining key aspects of ${title} and their practical applications`,
                    `Participated in academic competitions related to ${title}, achieving recognition`,
                    `Applied theoretical knowledge from ${title} studies in practical, real-world scenarios`,
                    `Collaborated with peers on group projects that demonstrated mastery of ${title} concepts`
                ];
            }

            // Certificate-specific suggestions
            else if (titleLower.includes('certif') || titleLower.includes('credential')) {
                titleSuggestions[titleLower] = [
                    `Earned ${title} certification demonstrating expertise in industry-standard practices`,
                    `Applied knowledge gained from ${title} certification to improve work processes`,
                    `Maintained ${title} credential through continuing education and professional development`,
                    `Leveraged ${title} certification to implement best practices within the organization`,
                    `Recognized for specialized knowledge validated by ${title} certification`
                ];
            }
        }

        // Combine base suggestions with context-specific and title-specific ones if available
        let combinedSuggestions = [...baseSuggestions];

        // Add context-specific suggestions
        if (context && contextSuggestions[context]) {
            combinedSuggestions = [...contextSuggestions[context], ...combinedSuggestions];
        }

        // Add title-specific suggestions
        if (title && titleSuggestions[title.toLowerCase()]) {
            combinedSuggestions = [...titleSuggestions[title.toLowerCase()], ...combinedSuggestions];
        }

        // If search term is provided, filter or prioritize suggestions
        if (searchTerm && searchTerm.trim().length > 0) {
            const searchLower = searchTerm.toLowerCase();
            // First include suggestions that contain the search term
            const matchingSuggestions = combinedSuggestions.filter(s =>
                s.toLowerCase().includes(searchLower)
            );
            // Then add other suggestions to maintain a good number of results
            const otherSuggestions = combinedSuggestions.filter(s =>
                !s.toLowerCase().includes(searchLower)
            );
            // Prioritize matching suggestions but keep a good total number
            combinedSuggestions = [...matchingSuggestions, ...otherSuggestions].slice(0, 10);
        }

        return combinedSuggestions;
    };

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
