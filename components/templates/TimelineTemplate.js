const TimelineTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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

    // Accent color for the timeline and highlights
    const accentColor = fontStyles.font_color || "#3B82F6";

    return (
        <div className="bg-white">
            {/* Main Template */}
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: fontStyles.font_color === "#000000" ? "#374151" : fontStyles.font_color,
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    padding: "20px",
                    minHeight: '250mm',
                    backgroundColor: "white",
                }}
            >
                {/* Header Section with visual flair */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-10">
                    <div className="mb-6 md:mb-0">
                        <h1
                            className={`font-bold ${isModalView ? 'text-4xl' : 'text-2xl'} mb-1`}
                            style={{ color: accentColor }}
                        >
                            {`${mergedData.first_name} ${mergedData.last_name}`}
                        </h1>
                        <div className={`${isModalView ? 'text-xl' : 'text-lg'} font-medium mb-2`}>
                            {mergedData.professional_summary}
                        </div>

                        {/* Professional description with stylized quote */}
                        <div
                            className={`relative border-l-4 pl-4 mt-4 max-w-lg ${isModalView ? 'text-base' : 'text-sm'}`}
                            style={{ borderLeftColor: accentColor }}
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                className="prose max-w-none italic text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Contact information with icons */}
                    <div className={`${isModalView ? 'text-base' : 'text-sm'} flex flex-col items-end space-y-1 text-gray-700`}>
                        <div className="flex items-center">
                            <span className="mr-2">📧</span>
                            <span>{mergedData.email}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">📱</span>
                            <span>{mergedData.phone}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                        </div>
                    </div>
                </div>

                {/* Skills & Languages - Placed prominently near the top */}
                <div className="mb-10">
                    <h2
                        className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                        style={{ color: accentColor }}
                    >
                        Skills & Languages
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Skills section */}
                        <div>
                            <h3 className={`font-medium ${isModalView ? 'text-lg' : 'text-base'} mb-2 text-gray-700`}>
                                Professional Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.skill && mergedData.skill.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-sm"
                                        style={{
                                            backgroundColor: `${accentColor}20`, // 20% opacity of accent color
                                            color: accentColor,
                                            border: `1px solid ${accentColor}40` // 40% opacity border
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Languages section */}
                        <div>
                            <h3 className={`font-medium ${isModalView ? 'text-lg' : 'text-base'} mb-2 text-gray-700`}>
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.language && mergedData.language.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-sm"
                                        style={{
                                            backgroundColor: "rgba(243, 244, 246, 1)",
                                            color: "#4B5563",
                                            border: "1px solid rgba(229, 231, 235, 1)"
                                        }}
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience Section with Timeline */}
                <div className="mb-10">
                    <h2
                        className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                        style={{ color: accentColor }}
                    >
                        Experience
                    </h2>

                    <div className="relative">
                        {/* Timeline track */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-px h-full"
                            style={{ backgroundColor: `${accentColor}40` }}
                        ></div>

                        {mergedData.job_title && mergedData.job_title.map((title, index) => (
                            <div key={index} className="relative ml-6 mb-8 pb-2">
                                {/* Timeline node */}
                                <div
                                    className="absolute left-0 w-4 h-4 rounded-full -ml-8 mt-1"
                                    style={{ backgroundColor: accentColor }}
                                ></div>

                                {/* Job details */}
                                <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-1`}>
                                    {title}
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span
                                        className="text-base font-medium"
                                        style={{ color: accentColor }}
                                    >
                                        {mergedData.employer[index]}
                                    </span>
                                    <span className={`text-gray-500 ${isModalView ? 'text-sm' : 'text-xs'}`}>
                                        {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                    </span>
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                    className="prose max-w-none text-gray-600"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <div className="mb-10">
                    <h2
                        className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                        style={{ color: accentColor }}
                    >
                        Education
                    </h2>

                    <div className="space-y-6">
                        {mergedData.college && mergedData.college.map((college, index) => (
                            <div key={index} className="flex flex-col md:flex-row md:items-start md:justify-between p-4 rounded-lg" style={{ backgroundColor: `${accentColor}08` }}>
                                <div className="mb-2 md:mb-0 md:mr-4 flex-1">
                                    <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-1`}>
                                        {mergedData.degree[index]}
                                    </div>
                                    <div
                                        className="text-base mb-2"
                                        style={{ color: accentColor }}
                                    >
                                        {college}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                        className="prose max-w-none text-gray-600"
                                    />
                                </div>
                                <div className="text-gray-500 text-right whitespace-nowrap">
                                    {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internships Section */}
                {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                    <div className="mb-10">
                        <h2
                            className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                            style={{ color: accentColor }}
                        >
                            Internships
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mergedData.internship_title.map((title, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-2`}>
                                        {title}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                        className="prose max-w-none text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certificates Section */}
                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                    <div className="mb-10">
                        <h2
                            className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                            style={{ color: accentColor }}
                        >
                            Certificates
                        </h2>

                        <div className="space-y-4">
                            {mergedData.certificate_title.map((title, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className="mr-3 text-xl"
                                        style={{ color: accentColor }}
                                    >
                                        🏆
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${isModalView ? 'text-base' : 'text-sm'}`}>
                                            {title}
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                            className="prose max-w-none text-gray-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other sections */}
                {mergedData.other_title && mergedData.other_title.map((title, index) => (
                    <div key={index} className="mb-10">
                        <h2
                            className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-4`}
                            style={{ color: accentColor }}
                        >
                            {title}
                        </h2>

                        <div className="prose max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineTemplate;