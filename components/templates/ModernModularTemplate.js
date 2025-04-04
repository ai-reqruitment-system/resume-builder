import React from 'react';

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

    // Define color palette
    const accentColor = fontStyles.font_color || '#4A90E2';
    const textColor = fontStyles.font_color === '#000000' ? '#333333' : fontStyles.font_color;

    return (
        <div className="bg-white p-8 max-w-4xl mx-auto">
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: textColor,
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    minHeight: '250mm',
                }}
            >
                {/* Header Section */}
                <div className="flex justify-between items-center border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
                    <div>
                        <h1
                            className={`font-bold text-left ${isModalView ? 'text-3xl' : 'text-2xl'} mb-2`}
                            style={{ color: accentColor }}
                        >
                            {`${mergedData.first_name} ${mergedData.last_name}`}
                        </h1>
                        <h2
                            className={`font-medium ${isModalView ? 'text-xl' : 'text-lg'} text-gray-700`}
                        >
                            {mergedData.occupation}
                        </h2>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p>{mergedData.email}</p>
                        <p>{mergedData.phone}</p>
                        <p>{`${mergedData.city}, ${mergedData.country}`}</p>
                    </div>
                </div>

                {/* Professional Summary */}
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Professional Summary
                    </h3>
                    <div
                        dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        className="prose max-w-none text-gray-700"
                    />
                </section>

                {/* Skills & Languages */}
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Skills & Languages
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Professional Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.skill && mergedData.skill.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-sm"
                                        style={{
                                            backgroundColor: `${accentColor}20`,
                                            color: accentColor,
                                            border: `1px solid ${accentColor}40`
                                        }}
                                    >
                    {skill}
                  </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Languages</h4>
                            <div className="flex flex-wrap gap-2">
                                {mergedData.language && mergedData.language.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                                    >
                    {lang}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Professional Experience
                    </h3>
                    {mergedData.job_title && mergedData.job_title.map((title, index) => (
                        <div key={index} className="mb-6 pb-4 border-b last:border-b-0" style={{ borderColor: `${accentColor}20` }}>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h4
                                        className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                    >
                                        {title}
                                    </h4>
                                    <p
                                        className="text-base font-medium"
                                        style={{ color: accentColor }}
                                    >
                                        {mergedData.employer[index]}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-600">
                  {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                </span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                className="prose max-w-none text-gray-700"
                            />
                        </div>
                    ))}
                </section>

                {/* Education */}
                <section className="mb-8">
                    <h3
                        className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Education
                    </h3>
                    {mergedData.college && mergedData.college.map((college, index) => (
                        <div key={index} className="mb-6 pb-4 border-b last:border-b-0" style={{ borderColor: `${accentColor}20` }}>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h4
                                        className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'}`}
                                    >
                                        {mergedData.degree[index]}
                                    </h4>
                                    <p
                                        className="text-base font-medium"
                                        style={{ color: accentColor }}
                                    >
                                        {college}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-600">
                  {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                </span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                className="prose max-w-none text-gray-700"
                            />
                        </div>
                    ))}
                </section>

                {/* Certificates */}
                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                    <section className="mb-8">
                        <h3
                            className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                            style={{ color: accentColor, borderColor: accentColor }}
                        >
                            Certificates
                        </h3>
                        {mergedData.certificate_title.map((title, index) => (
                            <div
                                key={index}
                                className="flex items-start mb-4 pb-4 border-b last:border-b-0"
                                style={{ borderColor: `${accentColor}20` }}
                            >
                                <div
                                    className="mr-4 text-2xl"
                                    style={{ color: accentColor }}
                                >
                                    🏆
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${isModalView ? 'text-base' : 'text-sm'}`}>
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
                            className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                            style={{ color: accentColor, borderColor: accentColor }}
                        >
                            Internships
                        </h3>
                        {mergedData.internship_title.map((title, index) => (
                            <div
                                key={index}
                                className="mb-4 pb-4 border-b last:border-b-0"
                                style={{ borderColor: `${accentColor}20` }}
                            >
                                <h4
                                    className={`font-semibold mb-2 ${isModalView ? 'text-base' : 'text-sm'}`}
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
                    <section key={index} className="mb-8">
                        <h3
                            className={`font-semibold border-b mb-4 pb-2 ${isModalView ? 'text-xl' : 'text-lg'}`}
                            style={{ color: accentColor, borderColor: accentColor }}
                        >
                            {title}
                        </h3>
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