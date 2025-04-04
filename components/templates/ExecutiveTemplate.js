const ExecutiveTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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
    const primaryColor = fontStyles.font_color || "#1E3A8A"; // Default to a strong blue
    const secondaryColor = "#64748B"; // Slate-500

    return (
        <div className="bg-white">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: "#334155", // Slate-700
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    minHeight: '250mm',
                }}
            >
                {/* Header with bold styling and horizontal rule */}
                <div
                    className="px-8 py-6 border-b-2"
                    style={{ borderColor: primaryColor }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                        <div>
                            <h1
                                className={`${isModalView ? 'text-4xl' : 'text-3xl'} font-bold mb-2`}
                                style={{ color: primaryColor }}
                            >
                                {`${mergedData.first_name} ${mergedData.last_name}`}
                            </h1>
                            <p className={`${isModalView ? 'text-xl' : 'text-lg'} font-semibold`}>
                                {mergedData.occupation}
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 text-right">
                            <div className="text-sm">
                                <p className="mb-1">{mergedData.email}</p>
                                <p className="mb-1">{mergedData.phone}</p>
                                <p>{`${mergedData.city}, ${mergedData.country}`}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two-column main content */}
                <div className="flex flex-col md:flex-row">
                    {/* Left column - smaller width */}
                    <div className="md:w-1/3 p-6 md:p-8">
                        {/* Professional Summary */}
                        <div className="mb-8">
                            <h2
                                className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 flex items-center`}
                                style={{ color: primaryColor }}
                            >
                <span
                    className="inline-block w-4 h-4 mr-2"
                    style={{ backgroundColor: primaryColor }}
                ></span>
                                EXECUTIVE SUMMARY
                            </h2>

                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                className="prose max-w-none text-sm"
                            />
                        </div>

                        {/* Skills Section */}
                        <div className="mb-8">
                            <h2
                                className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 flex items-center`}
                                style={{ color: primaryColor }}
                            >
                <span
                    className="inline-block w-4 h-4 mr-2"
                    style={{ backgroundColor: primaryColor }}
                ></span>
                                CORE COMPETENCIES
                            </h2>

                            <div className="space-y-2">
                                {mergedData.skill && mergedData.skill.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-baseline"
                                    >
                    <span
                        className="text-xs mr-2"
                        style={{ color: primaryColor }}
                    >■</span>
                                        <span className="text-sm">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        {mergedData.language && mergedData.language.length > 0 && (
                            <div className="mb-8">
                                <h2
                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 flex items-center`}
                                    style={{ color: primaryColor }}
                                >
                  <span
                      className="inline-block w-4 h-4 mr-2"
                      style={{ backgroundColor: primaryColor }}
                  ></span>
                                    LANGUAGES
                                </h2>

                                <div className="space-y-2">
                                    {mergedData.language.map((language, index) => (
                                        <div
                                            key={index}
                                            className="flex items-baseline"
                                        >
                      <span
                          className="text-xs mr-2"
                          style={{ color: primaryColor }}
                      >■</span>
                                            <span className="text-sm">{language}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificates */}
                        {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                            <div className="mb-8">
                                <h2
                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 flex items-center`}
                                    style={{ color: primaryColor }}
                                >
                  <span
                      className="inline-block w-4 h-4 mr-2"
                      style={{ backgroundColor: primaryColor }}
                  ></span>
                                    CERTIFICATIONS
                                </h2>

                                <div className="space-y-3">
                                    {mergedData.certificate_title.map((title, index) => (
                                        <div key={index} className="mb-2">
                                            <div className="font-medium text-sm mb-1">{title}</div>
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

                    {/* Right column - larger width */}
                    <div className="md:w-2/3 p-6 md:p-8 md:border-l" style={{ borderColor: `${primaryColor}40` }}>
                        {/* Experience */}
                        <div className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 flex items-center`}
                                style={{ color: primaryColor }}
                            >
                <span
                    className="inline-block w-4 h-4 mr-2"
                    style={{ backgroundColor: primaryColor }}
                ></span>
                                PROFESSIONAL EXPERIENCE
                            </h2>

                            {mergedData.job_title && mergedData.job_title.map((title, index) => (
                                <div key={index} className="mb-8">
                                    <div
                                        className="border-l-4 pl-4 pb-1 mb-4"
                                        style={{ borderColor: primaryColor }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3
                                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold`}
                                                    style={{ color: primaryColor }}
                                                >
                                                    {title}
                                                </h3>
                                                <p className="font-medium">{mergedData.employer[index]}</p>
                                            </div>
                                            <p
                                                className="text-xs font-semibold px-2 py-1 rounded ml-2 whitespace-nowrap"
                                                style={{
                                                    backgroundColor: `${primaryColor}10`,
                                                    color: primaryColor
                                                }}
                                            >
                                                {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                        className="prose max-w-none pl-4"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 flex items-center`}
                                style={{ color: primaryColor }}
                            >
                <span
                    className="inline-block w-4 h-4 mr-2"
                    style={{ backgroundColor: primaryColor }}
                ></span>
                                EDUCATION
                            </h2>

                            <div className="space-y-6">
                                {mergedData.college && mergedData.college.map((college, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 border-l-4 pl-4 pb-1"
                                        style={{ borderColor: primaryColor }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3
                                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold`}
                                                    style={{ color: primaryColor }}
                                                >
                                                    {mergedData.degree[index]}
                                                </h3>
                                                <p className="font-medium">{college}</p>
                                            </div>
                                            <p
                                                className="text-xs font-semibold px-2 py-1 rounded ml-2 whitespace-nowrap"
                                                style={{
                                                    backgroundColor: `${primaryColor}10`,
                                                    color: primaryColor
                                                }}
                                            >
                                                {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                            </p>
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                            className="prose max-w-none mt-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Internships */}
                        {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                            <div className="mb-10">
                                <h2
                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 flex items-center`}
                                    style={{ color: primaryColor }}
                                >
                  <span
                      className="inline-block w-4 h-4 mr-2"
                      style={{ backgroundColor: primaryColor }}
                  ></span>
                                    INTERNSHIP EXPERIENCE
                                </h2>

                                <div className="space-y-5">
                                    {mergedData.internship_title.map((title, index) => (
                                        <div
                                            key={index}
                                            className="mb-4 border-l-4 pl-4 pb-1"
                                            style={{ borderColor: primaryColor }}
                                        >
                                            <h3
                                                className={`font-bold mb-2`}
                                                style={{ color: primaryColor }}
                                            >
                                                {title}
                                            </h3>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                                className="prose max-w-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Sections */}
                        {mergedData.other_title && mergedData.other_title.map((title, index) => (
                            <div key={index} className="mb-10">
                                <h2
                                    className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 flex items-center`}
                                    style={{ color: primaryColor }}
                                >
                  <span
                      className="inline-block w-4 h-4 mr-2"
                      style={{ backgroundColor: primaryColor }}
                  ></span>
                                    {title.toUpperCase()}
                                </h2>

                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                                    className="prose max-w-none pl-4"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveTemplate;