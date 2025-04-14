const MinimalistTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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
    const accentColor = fontStyles.font_color || "#111827"; // Default to dark gray if not provided

    return (
        <div className="bg-white">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: "#4B5563", // Gray-600
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    padding: "40px",
                    minHeight: '250mm',
                    maxWidth: '210mm',
                    margin: '0 auto',
                    backgroundColor: "white",
                }}
            >
                {/* Header - Clean and minimal */}
                <header className="mb-10">
                    <h1
                        className={`${isModalView ? 'text-4xl' : 'text-3xl'} font-light tracking-tight mb-2`}
                        style={{ color: accentColor }}
                    >
                        {`${mergedData.first_name} ${mergedData.last_name}`}
                    </h1>

                    <div className={`${isModalView ? 'text-xl' : 'text-lg'} font-normal mb-4`}>
                        {mergedData.professional_summary}
                    </div>

                    {/* Contact Information Row */}
                    <div className="flex flex-wrap text-sm text-gray-500 gap-x-5 gap-y-2">
                        <div>{mergedData.email}</div>
                        <div>{mergedData.phone}</div>
                        <div>{`${mergedData.city}, ${mergedData.country}`}</div>
                    </div>
                </header>

                {/* Professional Summary - With elegant typography */}
                {mergedData.professional_description && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-3 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Profile
                        </h2>

                        <div
                            className="text-gray-700 max-w-3xl"
                            dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        />
                    </section>
                )}

                {/* Experience - Clean timeline style */}
                {mergedData.job_title && mergedData.job_title.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Experience
                        </h2>

                        <div className="space-y-6">
                            {mergedData.job_title.map((title, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Date column */}
                                    <div className="text-sm text-gray-500 md:text-right">
                                        {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                    </div>

                                    {/* Content column */}
                                    <div className="md:col-span-3">
                                        <h3
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-medium mb-1`}
                                            style={{ color: accentColor }}
                                        >
                                            {title}
                                        </h3>
                                        <div className="text-gray-600 mb-2">{mergedData.employer[index]}</div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                            className="prose max-w-none text-gray-700"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education - Same layout as experience for consistency */}
                {mergedData.college && mergedData.college.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Education
                        </h2>

                        <div className="space-y-6">
                            {mergedData.college.map((college, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Date column */}
                                    <div className="text-sm text-gray-500 md:text-right">
                                        {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                    </div>

                                    {/* Content column */}
                                    <div className="md:col-span-3">
                                        <h3
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-medium mb-1`}
                                            style={{ color: accentColor }}
                                        >
                                            {mergedData.degree[index]}
                                        </h3>
                                        <div className="text-gray-600 mb-2">{college}</div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                            className="prose max-w-none text-gray-700"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Languages in 2-column layout */}
                {(mergedData.skill || mergedData.language) && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Skills & Languages
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills Column */}
                            {mergedData.skill && mergedData.skill.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3 text-gray-700">Technical Skills</h3>
                                    <div className="flex flex-wrap gap-y-1 gap-x-1">
                                        {mergedData.skill.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="mr-2 mb-2 px-0 py-0"
                                            >
                                                {index > 0 ? ` • ${skill}` : skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages Column */}
                            {mergedData.language && mergedData.language.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3 text-gray-700">Languages</h3>
                                    <div className="flex flex-wrap gap-y-1 gap-x-1">
                                        {mergedData.language.map((language, index) => (
                                            <div
                                                key={index}
                                                className="mr-2 mb-2 px-0 py-0"
                                            >
                                                {index > 0 ? ` • ${language}` : language}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Internships */}
                {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Internships
                        </h2>

                        <div className="space-y-6">
                            {mergedData.internship_title.map((title, index) => (
                                <div key={index}>
                                    <h3
                                        className={`${isModalView ? 'text-lg' : 'text-base'} font-medium mb-2`}
                                        style={{ color: accentColor }}
                                    >
                                        {title}
                                    </h3>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                        className="prose max-w-none text-gray-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates */}
                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            Certificates
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mergedData.certificate_title.map((title, index) => (
                                <div key={index} className="mb-3">
                                    <h3
                                        className={`text-base font-medium mb-1`}
                                        style={{ color: accentColor }}
                                    >
                                        {title}
                                    </h3>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                        className="prose max-w-none text-sm text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Other Sections */}
                {mergedData.other_title && mergedData.other_title.map((title, index) => (
                    <section key={index} className="mb-10">
                        <h2
                            className={`font-normal ${isModalView ? 'text-xl' : 'text-lg'} mb-5 uppercase tracking-wide`}
                            style={{ color: accentColor }}
                        >
                            {title}
                        </h2>

                        <div
                            dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                            className="prose max-w-none text-gray-700"
                        />
                    </section>
                ))}
            </div>
        </div>
    );
};

export default MinimalistTemplate;