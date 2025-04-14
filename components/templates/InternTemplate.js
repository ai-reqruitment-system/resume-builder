import React from 'react';

const InnovativeTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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

    // Unique color palette
    const primaryColor = fontStyles.font_color || '#1A5F7A';
    const secondaryColor = '#2C8CB4';

    return (
        <div
            className="bg-white p-8 max-w-4xl mx-auto relative"
            style={{
                fontFamily: fontStyles.font_family,
                color: '#333',
                fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                minHeight: '250mm',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
        >
            {/* Decorative Element */}
            <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: primaryColor }}
            />

            {/* Header Section */}
            <div className="mb-8 pt-4 relative">
                <div className="flex justify-between items-center">
                    <div>
                        <h1
                            className={`font-bold text-left ${isModalView ? 'text-3xl' : 'text-2xl'} mb-2`}
                            style={{ color: primaryColor }}
                        >
                            {`${mergedData.first_name} ${mergedData.last_name}`}
                        </h1>
                        <h2
                            className={`font-medium ${isModalView ? 'text-xl' : 'text-lg'} text-gray-700`}
                            style={{ color: secondaryColor }}
                        >
                            {mergedData.professional_summary}
                        </h2>
                    </div>
                    <div
                        className="text-right text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"
                        style={{ border: `1px solid ${primaryColor}20` }}
                    >
                        <p>{mergedData.email}</p>
                        <p>{mergedData.phone}</p>
                        <p>{`${mergedData.city}, ${mergedData.country}`}</p>
                    </div>
                </div>
            </div>

            {/* Professional Summary */}
            {mergedData.professional_description && (
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        Professional Summary
                    </h3>
                    <div
                        dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        className="prose max-w-none text-gray-700 italic"
                        style={{
                            backgroundColor: `${primaryColor}10`,
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                </section>
            )}

            {/* Skills & Languages */}
            <section className="mb-8">
                <h3
                    className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                    style={{
                        color: primaryColor,
                        borderColor: secondaryColor
                    }}
                >
                    Skills & Languages
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    {mergedData.skill && mergedData.skill.length > 0 && (
                        <div>
                            <h4
                                className="font-medium mb-3 text-gray-700"
                                style={{ color: secondaryColor }}
                            >
                                Professional Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.skill.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-xs"
                                        style={{
                                            backgroundColor: `${primaryColor}20`,
                                            color: primaryColor,
                                            border: `1px solid ${primaryColor}40`
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {mergedData.language && mergedData.language.length > 0 && (
                        <div>
                            <h4
                                className="font-medium mb-3 text-gray-700"
                                style={{ color: secondaryColor }}
                            >
                                Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.language.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-xs"
                                        style={{
                                            backgroundColor: `${secondaryColor}20`,
                                            color: secondaryColor,
                                            border: `1px solid ${secondaryColor}40`
                                        }}
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Professional Experience */}
            {mergedData.job_title && mergedData.job_title.length > 0 && (
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        Professional Experience
                    </h3>
                    {mergedData.job_title.map((title, index) => (
                        <div
                            key={index}
                            className="mb-6 p-4 rounded-lg"
                            style={{
                                backgroundColor: `${primaryColor}10`,
                                border: `1px solid ${primaryColor}20`
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4
                                        className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                        style={{ color: secondaryColor }}
                                    >
                                        {title}
                                    </h4>
                                    <p className="text-gray-700 text-sm">
                                        {mergedData.employer[index]}
                                    </p>
                                </div>
                                <span
                                    className="text-xs text-gray-600 px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: `${primaryColor}20`,
                                        color: primaryColor
                                    }}
                                >
                                    {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                </span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                className="prose max-w-none text-gray-700 text-sm"
                            />
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {mergedData.college && mergedData.college.length > 0 && (
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        Education
                    </h3>
                    {mergedData.college.map((college, index) => (
                        <div
                            key={index}
                            className="mb-6 p-4 rounded-lg"
                            style={{
                                backgroundColor: `${secondaryColor}10`,
                                border: `1px solid ${secondaryColor}20`
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4
                                        className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                        style={{ color: primaryColor }}
                                    >
                                        {mergedData.degree[index]}
                                    </h4>
                                    <p className="text-gray-700 text-sm">
                                        {college}
                                    </p>
                                </div>
                                <span
                                    className="text-xs text-gray-600 px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: `${primaryColor}20`,
                                        color: primaryColor
                                    }}
                                >
                                    {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                </span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                className="prose max-w-none text-gray-700 text-sm"
                            />
                        </div>
                    ))}
                </section>
            )}

            {/* Certificates */}
            {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        Certificates
                    </h3>
                    {mergedData.certificate_title.map((title, index) => (
                        <div
                            key={index}
                            className="flex items-start mb-4 p-3 rounded-lg"
                            style={{
                                backgroundColor: `${primaryColor}10`,
                                border: `1px solid ${primaryColor}20`
                            }}
                        >
                            <div
                                className="mr-4 text-2xl"
                                style={{ color: secondaryColor }}
                            >
                                🏆
                            </div>
                            <div>
                                <h4
                                    className={`font-semibold ${isModalView ? 'text-base' : 'text-sm'}`}
                                    style={{ color: primaryColor }}
                                >
                                    {title}
                                </h4>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                    className="prose max-w-none text-gray-700 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Internships */}
            {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        Internships
                    </h3>
                    {mergedData.internship_title.map((title, index) => (
                        <div
                            key={index}
                            className="mb-4 p-3 rounded-lg"
                            style={{
                                backgroundColor: `${secondaryColor}10`,
                                border: `1px solid ${secondaryColor}20`
                            }}
                        >
                            <h4
                                className={`font-semibold mb-2 ${isModalView ? 'text-base' : 'text-sm'}`}
                                style={{ color: primaryColor }}
                            >
                                {title}
                            </h4>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                className="prose max-w-none text-gray-700 text-sm"
                            />
                        </div>
                    ))}
                </section>
            )}

            {/* Other Sections */}
            {mergedData.other_title && mergedData.other_title.map((title, index) => (
                <section
                    key={index}
                    className="mb-8"
                >
                    <h3
                        className={`font-semibold border-b-2 mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{
                            color: primaryColor,
                            borderColor: secondaryColor
                        }}
                    >
                        {title}
                    </h3>
                    <div
                        dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                        className="prose max-w-none text-gray-700 text-sm"
                    />
                </section>
            ))}
        </div>
    );
};

export default InnovativeTemplate;