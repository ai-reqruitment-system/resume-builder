const PortfolioTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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

    // Primary and secondary colors
    const primaryColor = fontStyles.font_color || "#6366F1"; // Indigo by default
    const secondaryColor = "#4B5563"; // Gray-600

    return (
        <div className="bg-white">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: secondaryColor,
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    padding: "0",
                    minHeight: '250mm',
                }}
            >
                {/* Side Panel + Main Content Layout */}
                <div className="flex flex-col md:flex-row">
                    {/* Side Panel */}
                    <div
                        className="md:w-1/3 p-6 md:p-8"
                        style={{
                            backgroundColor: `${primaryColor}10`,
                            borderRight: `4px solid ${primaryColor}`
                        }}
                    >
                        {/* Profile */}
                        <div className="text-center mb-8">
                            <div
                                className={`font-bold ${isModalView ? 'text-3xl' : 'text-2xl'} mb-1`}
                                style={{ color: primaryColor }}
                            >
                                {`${mergedData.first_name} ${mergedData.last_name}`}
                            </div>
                            <div className={`${isModalView ? 'text-xl' : 'text-lg'} font-medium mb-3`}>
                                {mergedData.professional_summary}
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2 mb-6 text-left">
                                <div className="flex items-center text-sm">
                                    <span className="w-6 text-center mr-2" style={{ color: primaryColor }}>📧</span>
                                    <span>{mergedData.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="w-6 text-center mr-2" style={{ color: primaryColor }}>📱</span>
                                    <span>{mergedData.phone}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="w-6 text-center mr-2" style={{ color: primaryColor }}>📍</span>
                                    <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="mb-8">
                            <h2
                                className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-4 border-b`}
                                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                            >
                                Skills
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {mergedData.skill && mergedData.skill.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm mb-2 rounded-lg"
                                        style={{
                                            backgroundColor: `${primaryColor}20`,
                                            color: primaryColor
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Languages Section */}
                        <div className="mb-8">
                            <h2
                                className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-4 border-b`}
                                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                            >
                                Languages
                            </h2>

                            <div className="space-y-3">
                                {mergedData.language && mergedData.language.map((lang, index) => (
                                    <div key={index} className="flex items-center">
                                        <span
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: primaryColor }}
                                        ></span>
                                        <span>{lang}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certificates Section */}
                        {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                            <div className="mb-8">
                                <h2
                                    className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-4 border-b`}
                                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                                >
                                    Certificates
                                </h2>

                                {mergedData.certificate_title.map((title, index) => (
                                    <div key={index} className="mb-3">
                                        <div className={`font-medium ${isModalView ? 'text-base' : 'text-sm'} mb-1`}>
                                            {title}
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                            className="prose prose-sm max-w-none text-gray-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="md:w-2/3 p-6 md:p-8">
                        {/* Professional Summary */}
                        <div className="mb-8">
                            <h2
                                className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-4 border-b-2`}
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Professional Summary
                            </h2>

                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                className="prose max-w-none"
                            />
                        </div>

                        {/* Experience Section */}
                        <div className="mb-10">
                            <h2
                                className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-6 border-b-2`}
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Professional Experience
                            </h2>

                            {mergedData.job_title && mergedData.job_title.map((title, index) => (
                                <div key={index} className="mb-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div
                                                className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                                style={{ color: primaryColor }}
                                            >
                                                {title}
                                            </div>
                                            <div className="font-medium mb-1">{mergedData.employer[index]}</div>
                                        </div>
                                        <div
                                            className="inline-block px-3 py-1 text-xs rounded-full"
                                            style={{
                                                backgroundColor: `${primaryColor}15`,
                                                color: primaryColor
                                            }}
                                        >
                                            {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                        </div>
                                    </div>

                                    <div className="pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                            className="prose max-w-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Education Section */}
                        <div className="mb-10">
                            <h2
                                className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-6 border-b-2`}
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Education
                            </h2>

                            <div className="space-y-6">
                                {mergedData.college && mergedData.college.map((college, index) => (
                                    <div key={index} className="mb-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div
                                                    className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                                    style={{ color: primaryColor }}
                                                >
                                                    {mergedData.degree[index]}
                                                </div>
                                                <div className="font-medium mb-1">{college}</div>
                                            </div>
                                            <div
                                                className="inline-block px-3 py-1 text-xs rounded-full"
                                                style={{
                                                    backgroundColor: `${primaryColor}15`,
                                                    color: primaryColor
                                                }}
                                            >
                                                {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                            </div>
                                        </div>

                                        <div className="pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                                className="prose max-w-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Internships Section */}
                        {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                            <div className="mb-10">
                                <h2
                                    className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-6 border-b-2`}
                                    style={{ color: primaryColor, borderColor: primaryColor }}
                                >
                                    Internships
                                </h2>

                                <div className="space-y-5">
                                    {mergedData.internship_title.map((title, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg"
                                            style={{ backgroundColor: `${primaryColor}05` }}
                                        >
                                            <div
                                                className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-2`}
                                                style={{ color: primaryColor }}
                                            >
                                                {title}
                                            </div>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                                className="prose max-w-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other sections */}
                        {mergedData.other_title && mergedData.other_title.map((title, index) => (
                            <div key={index} className="mb-10">
                                <h2
                                    className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} pb-2 mb-4 border-b-2`}
                                    style={{ color: primaryColor, borderColor: primaryColor }}
                                >
                                    {title}
                                </h2>

                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                                    className="prose max-w-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioTemplate;