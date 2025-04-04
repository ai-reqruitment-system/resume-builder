import { useState } from 'react';
import axios from 'axios';

export const useSuggestionGenerator = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const generateSuggestions = async (title, customPrompt) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional descriptions for this job title or search term. Make suggestions diverse, specific, and relevant to modern resume standards: ${title}.`,
                        },
                        {
                            role: "user",
                            content: customPrompt
                                ? `${customPrompt} : ${title}. Please provide at least 8-10 detailed and diverse suggestions.`
                                : `Give me a comprehensive list of at least 8-10 professional descriptions for this job title or search term: ${title}. Make them specific and relevant.`
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
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        suggestions,
        isLoading,
        searchTerm,
        setSearchTerm,
        generateSuggestions,
        setSuggestions
    };
};
