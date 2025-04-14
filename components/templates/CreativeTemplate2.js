const Creative2Template = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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

    // Color settings
    const mainColor = fontStyles.font_color || "#8B5CF6"; // Default to violet-500
    const textColor = "#374151"; // Gray-700

    return (
        <div className="bg-white">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: textColor,
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    minHeight: '250mm',
                }}
            >
                {/* Header with diagonal design element */}
                <div className="relative overflow-hidden">
                    {/* Diagonal background element */}
                    <div
                        className="absolute top-0 right-0 w-2/3 h-full transform -skew-x-12 origin-top-right z-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row justify-between">
                        <div>
                            <h1
                                className={`${isModalView ? 'text-5xl' : 'text-4xl'} font-bold tracking-tight mb-2`}
                                style={{ color: mainColor }}
                            >
                                {mergedData.first_name} <span className="font-light">{mergedData.last_name}</span>
                            </h1>
                            <p
                                className={`${isModalView ? 'text-xl' : 'text-lg'} mb-4 font-light tracking-wider`}
                            >
                                {mergedData.professional_summary}
                            </p>

                            {/* Profile summary with stylized border */}
                            {mergedData.professional_description && (
                                <div
                                    className="max-w-lg mt-4 text-sm relative pl-4"
                                    style={{ borderLeft: `2px dashed ${mainColor}` }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                        className="prose max-w-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Contact information with icons */}
                        <div className="mt-6 md:mt-0 flex flex-col space-y-2 md:items-end">
                            <div className="flex items-center">
                                <span className="w-5 h-5 mr-2 flex items-center justify-center" style={{ color: mainColor }}>
                                    ✉
                                </span>
                                <span className="text-sm">{mergedData.email}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-5 h-5 mr-2 flex items-center justify-center" style={{ color: mainColor }}>
                                    ☎
                                </span>
                                <span className="text-sm">{mergedData.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-5 h-5 mr-2 flex items-center justify-center" style={{ color: mainColor }}>
                                    ⌂
                                </span>
                                <span className="text-sm">{`${mergedData.city}, ${mergedData.country}`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content with creative layout */}
                <div className="px-8 py-6">
                    {/* Experience section with creative styling */}
                    {mergedData.job_title && mergedData.job_title.length > 0 && (
                        <div className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-2xl' : 'text-xl'} font-bold mb-6 inline-block relative`}
                                style={{ color: mainColor }}
                            >
                                Work Experience
                                <span
                                    className="absolute bottom-0 left-0 w-full h-1 mt-1"
                                    style={{ backgroundColor: mainColor }}
                                ></span>
                            </h2>

                            <div className="space-y-8">
                                {mergedData.job_title.map((title, index) => (
                                    <div key={index} className="relative">
                                        {/* Dot and connecting line */}
                                        <div
                                            className="absolute left-0 top-0 w-3 h-3 rounded-full mt-1.5"
                                            style={{ backgroundColor: mainColor }}
                                        ></div>
                                        <div
                                            className="absolute left-1.5 top-4 bottom-0 w-px"
                                            style={{ backgroundColor: index === mergedData.job_title.length - 1 ? 'transparent' : `${mainColor}40` }}
                                        ></div>

                                        {/* Content */}
                                        <div className="pl-8">
                                            <div className="flex flex-wrap justify-between items-start mb-2">
                                                <div className="mr-4">
                                                    <h3
                                                        className={`${isModalView ? 'text-xl' : 'text-lg'} font-semibold`}
                                                        style={{ color: mainColor }}
                                                    >
                                                        {title}
                                                    </h3>
                                                    <p className="text-base text-gray-600">{mergedData.employer[index]}</p>
                                                </div>
                                                <div
                                                    className="text-sm py-1 px-3 rounded-full mt-1"
                                                    style={{
                                                        backgroundColor: `${mainColor}15`,
                                                        color: mainColor
                                                    }}
                                                >
                                                    {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                                </div>
                                            </div>
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

                    {/* Three-column grid for skills, languages, and certifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Skills column */}
                        {mergedData.skill && mergedData.skill.length > 0 && (
                            <div>
                                <h2
                                    className="text-lg font-bold mb-4 inline-block relative"
                                    style={{ color: mainColor }}
                                >
                                    Skills
                                    <span
                                        className="absolute bottom-0 left-0 w-full h-0.5 mt-1"
                                        style={{ backgroundColor: mainColor }}
                                    ></span>
                                </h2>

                                <div className="flex flex-wrap gap-2">
                                    {mergedData.skill.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="text-sm px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: `${mainColor}15`,
                                                color: mainColor
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages column */}
                        {mergedData.language && mergedData.language.length > 0 && (
                            <div>
                                <h2
                                    className="text-lg font-bold mb-4 inline-block relative"
                                    style={{ color: mainColor }}
                                >
                                    Languages
                                    <span
                                        className="absolute bottom-0 left-0 w-full h-0.5 mt-1"
                                        style={{ backgroundColor: mainColor }}
                                    ></span>
                                </h2>

                                <div className="flex flex-wrap gap-2">
                                    {mergedData.language.map((language, index) => (
                                        <span
                                            key={index}
                                            className="text-sm px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: "rgba(243, 244, 246, 1)",
                                                color: textColor,
                                                border: "1px solid rgba(229, 231, 235, 1)"
                                            }}
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications column */}
                        {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                            <div>
                                <h2
                                    className="text-lg font-bold mb-4 inline-block relative"
                                    style={{ color: mainColor }}
                                >
                                    Certifications
                                    <span
                                        className="absolute bottom-0 left-0 w-full h-0.5 mt-1"
                                        style={{ backgroundColor: mainColor }}
                                    ></span>
                                </h2>

                                <div className="space-y-2">
                                    {mergedData.certificate_title.map((title, index) => (
                                        <div
                                            key={index}
                                            className="text-sm"
                                        >
                                            <div className="font-medium mb-1">{title}</div>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                                className="prose max-w-none text-xs text-gray-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Education section with creative cards */}
                    {mergedData.college && mergedData.college.length > 0 && (
                        <div className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-2xl' : 'text-xl'} font-bold mb-6 inline-block relative`}
                                style={{ color: mainColor }}
                            >
                                Education
                                <span
                                    className="absolute bottom-0 left-0 w-full h-1 mt-1"
                                    style={{ backgroundColor: mainColor }}
                                ></span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mergedData.college.map((college, index) => (
                                    <div
                                        key={index}
                                        className="p-5 rounded-lg relative overflow-hidden"
                                        style={{
                                            backgroundColor: `${mainColor}05`,
                                            border: `1px solid ${mainColor}20`
                                        }}
                                    >
                                        {/* Decorative diagonal line */}
                                        <div
                                            className="absolute top-0 right-0 w-12 h-12 transform rotate-45 translate-x-6 -translate-y-6"
                                            style={{ backgroundColor: `${mainColor}20` }}
                                        ></div>

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3
                                                    className="text-lg font-semibold mb-1"
                                                    style={{ color: mainColor }}
                                                >
                                                    {mergedData.degree[index]}
                                                </h3>
                                                <p className="text-base mb-2">{college}</p>
                                            </div>
                                            <div
                                                className="text-xs py-1 px-2 rounded-full"
                                                style={{
                                                    backgroundColor: `${mainColor}15`,
                                                    color: mainColor
                                                }}
                                            >
                                                {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                            </div>
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                            className="prose max-w-none text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Internships */}
                    {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                        <div className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-2xl' : 'text-xl'} font-bold mb-6 inline-block relative`}
                                style={{ color: mainColor }}
                            >
                                Internships
                                <span
                                    className="absolute bottom-0 left-0 w-full h-1 mt-1"
                                    style={{ backgroundColor: mainColor }}
                                ></span>
                            </h2>

                            <div className="flex flex-wrap -mx-2">
                                {mergedData.internship_title.map((title, index) => (
                                    <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                                        <div
                                            className="h-full p-4 relative border-l-2"
                                            style={{ borderColor: mainColor }}
                                        >
                                            <h3
                                                className="text-lg font-semibold mb-2"
                                                style={{ color: mainColor }}
                                            >
                                                {title}
                                            </h3>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                                className="prose max-w-none text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Sections */}
                    {mergedData.other_title && mergedData.other_title.map((title, index) => (
                        <div key={index} className="mb-10">
                            <h2
                                className={`${isModalView ? 'text-2xl' : 'text-xl'} font-bold mb-6 inline-block relative`}
                                style={{ color: mainColor }}
                            >
                                {title}
                                <span
                                    className="absolute bottom-0 left-0 w-full h-1 mt-1"
                                    style={{ backgroundColor: mainColor }}
                                ></span>
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
    );
};

export default Creative2Template;