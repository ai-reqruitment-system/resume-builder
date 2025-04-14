const GradientAccentTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
    const mergeDataWithDefaults = (data, defaultData) => {
        const mergedData = { ...defaultData };
        for (const key in data) {
            if (Array.isArray(data[key])) {
                const hasNonEmptyValues = data[key].some(item => item !== '' && item !== undefined);
                if (data[key].length > 0 && hasNonEmptyValues) {
                    mergedData[key] = data[key];
                }
            } else if (data[key] !== undefined && data[key] !== '') {
                mergedData[key] = data[key];
            }
        }
        return mergedData;
    };

    const mergedData = mergeDataWithDefaults(data, defaultData);

    // Main color from fontStyles
    const baseColor = fontStyles.font_color || "#6D28D9"; // Default to purple-700

    // Create a gradient from the base color
    const getGradient = (baseColor, opacity = 1) => {
        return `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(baseColor, 40)} 100%)`;
    };

    // Function to adjust a color (lighten/darken)
    const adjustColor = (color, amount) => {
        // Simple implementation - in a real app you'd want a more robust solution
        // This just creates a lighter color for the gradient
        return color + Math.abs(amount).toString(16).padStart(2, '0');
    };

    return (
        <div className="bg-white">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: "#1F2937", // Gray-800
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    minHeight: '250mm',
                }}
            >
                {/* Header with vertical gradient accent */}
                <div className="flex flex-col md:flex-row">
                    {/* Left gradient accent */}
                    <div
                        className="md:w-1/12 w-full h-4 md:h-auto"
                        style={{
                            background: getGradient(baseColor),
                        }}
                    ></div>

                    {/* Header content */}
                    <div className="md:w-11/12 p-8">
                        <h1
                            className={`${isModalView ? 'text-4xl' : 'text-3xl'} font-bold tracking-tight mb-1`}
                            style={{ color: baseColor }}
                        >
                            {`${mergedData.first_name} ${mergedData.last_name}`}
                        </h1>

                        <p className={`${isModalView ? 'text-xl' : 'text-lg'} mb-4 font-medium text-gray-500`}>
                            {mergedData.professional_summary}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: baseColor }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{mergedData.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: baseColor }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{mergedData.phone}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: baseColor }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                            </div>
                        </div>

                        {/* Professional Summary */}
                        {mergedData.professional_description && (
                            <div className="mb-10">
                                <h2
                                    className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-3 pb-1 border-b w-fit`}
                                    style={{ borderColor: baseColor }}
                                >
                                    PROFESSIONAL SUMMARY
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                    className="prose max-w-3xl text-gray-700"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content with Accent Highlights */}
                <div className="px-8 pt-0 pb-8">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Left Column */}
                        <div className="md:w-4/12 space-y-8">
                            {/* Skills Section */}
                            {mergedData.skill && mergedData.skill.length > 0 && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-4 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        SKILLS
                                    </h2>

                                    <div className="space-y-4">
                                        {mergedData.skill.map((skill, index) => (
                                            <div key={index} className="relative">
                                                <div
                                                    className="absolute top-0 bottom-0 left-0 w-1 h-full rounded"
                                                    style={{ background: getGradient(baseColor) }}
                                                ></div>
                                                <div className="pl-4 py-1">{skill}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages Section */}
                            {mergedData.language && mergedData.language.length > 0 && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-4 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        LANGUAGES
                                    </h2>

                                    <div className="space-y-2">
                                        {mergedData.language.map((language, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ background: getGradient(baseColor) }}
                                                ></span>
                                                <span>{language}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education Section */}
                            {mergedData.college && mergedData.college.length > 0 && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-4 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        EDUCATION
                                    </h2>

                                    <div className="space-y-5">
                                        {mergedData.college.map((college, index) => (
                                            <div key={index} className="relative pl-4">
                                                <div
                                                    className="absolute top-0 bottom-0 left-0 w-1 h-full rounded"
                                                    style={{ background: getGradient(baseColor) }}
                                                ></div>

                                                <h3
                                                    className="text-base font-bold mb-1"
                                                    style={{ color: baseColor }}
                                                >
                                                    {mergedData.degree[index]}
                                                </h3>
                                                <p className="text-sm font-medium mb-1">{college}</p>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                                </p>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                                    className="prose max-w-none text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certificates Section */}
                            {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-4 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        CERTIFICATIONS
                                    </h2>

                                    <div className="space-y-4">
                                        {mergedData.certificate_title.map((title, index) => (
                                            <div key={index} className="relative pl-4">
                                                <div
                                                    className="absolute top-0 bottom-0 left-0 w-1 h-full rounded"
                                                    style={{ background: getGradient(baseColor) }}
                                                ></div>

                                                <h3 className="text-sm font-bold mb-1">{title}</h3>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                                    className="prose max-w-none text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Experience */}
                        <div className="md:w-8/12">
                            {/* Experience Section */}
                            {mergedData.job_title && mergedData.job_title.length > 0 && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-6 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        PROFESSIONAL EXPERIENCE
                                    </h2>

                                    <div className="space-y-10">
                                        {mergedData.job_title.map((title, index) => (
                                            <div key={index} className="relative">
                                                {/* Vertical timeline line with gradient */}
                                                <div className="absolute top-0 bottom-0 left-14 w-0.5 h-full" style={{
                                                    background: index === mergedData.job_title.length - 1
                                                        ? `linear-gradient(to bottom, ${baseColor} 0%, transparent 100%)`
                                                        : baseColor
                                                }}></div>

                                                {/* Date circle */}
                                                <div className="absolute left-0 top-0 flex flex-col items-center w-28">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center z-10 text-white font-bold"
                                                        style={{ background: getGradient(baseColor) }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div className="text-xs text-center text-gray-500 mt-2">
                                                        {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="ml-32">
                                                    <h3
                                                        className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-1`}
                                                        style={{ color: baseColor }}
                                                    >
                                                        {title}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-600 mb-3">
                                                        {mergedData.employer[index]}
                                                    </p>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                                        className="prose max-w-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Internships Section */}
                            {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                                <div className="mt-12">
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-6 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        INTERNSHIPS
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {mergedData.internship_title.map((title, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded relative overflow-hidden"
                                            >
                                                {/* Diagonal gradient accent */}
                                                <div
                                                    className="absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-10 -translate-y-10"
                                                    style={{ background: getGradient(baseColor, 0.15) }}
                                                ></div>

                                                <h3
                                                    className="text-base font-bold mb-2 relative z-10"
                                                    style={{ color: baseColor }}
                                                >
                                                    {title}
                                                </h3>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                                    className="prose max-w-none text-sm relative z-10"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Sections */}
                            {mergedData.other_title && mergedData.other_title.map((title, index) => (
                                <div key={index} className="mt-12">
                                    <h2
                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-bold mb-4 pb-1 border-b w-fit`}
                                        style={{ borderColor: baseColor }}
                                    >
                                        {title.toUpperCase()}
                                    </h2>

                                    <div className="relative">
                                        <div
                                            className="absolute top-0 bottom-0 left-0 w-1 h-full rounded"
                                            style={{ background: getGradient(baseColor) }}
                                        ></div>
                                        <div className="pl-4">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                                                className="prose max-w-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientAccentTemplate;