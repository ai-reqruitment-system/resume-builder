import React from 'react';

const CreativeTemplate = ({
    data = {},
    fontStyles,
    isModalView = false,
    defaultData = {},
}) => {
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
    const styles = {
        primaryColor: 'indigo-500',
        secondaryColor: 'purple-500',
        headerGradient: {
            from: 'indigo-500',
            to: 'purple-500'
        },
        fontFamily: 'sans',
        fontSize: {
            header: 'text-3xl',
            title: 'text-2xl',
            subtitle: 'text-xl',
            body: 'text-base'
        },
        spacing: {
            section: 'mb-8',
            element: 'mb-4'
        },
        borderRadius: 'rounded-lg',
        shadow: 'shadow-lg'
    };
    const mergedData = mergeDataWithDefaults(data, defaultData);

    return (
        <div
            style={{
                fontFamily: fontStyles.font_family,
                color: fontStyles.font_color,
                fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
            }}
            className={`w-full max-w-4xl mx-auto bg-white ${styles.shadow} ${styles.borderRadius} font-${styles.fontFamily}`}>
            <div className="p-8">
                {/* Header */}
                <div className={`bg-gradient-to-r from-${styles.headerGradient.from} to-${styles.headerGradient.to} 
          p-8 ${styles.borderRadius} text-white ${styles.spacing.section}`}>
                    <h1 className={`${styles.fontSize.header} font-bold mb-2`}>
                        {`${mergedData.first_name} ${mergedData.last_name}`}
                    </h1>
                    <p className={`${styles.fontSize.subtitle} opacity-90 mb-4`}>
                        {mergedData.professional_summary}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { icon: 'envelope', text: mergedData.email },
                            { icon: 'phone', text: mergedData.phone },
                            { icon: 'location-dot', text: `${mergedData.city}, ${mergedData.country}` }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                                <i className={`fas fa-${item.icon} mr-2`} />
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                {[
                    {
                        title: 'Professional Summary',
                        content: (
                            <div dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                className="prose max-w-none" />
                        )
                    },
                    {
                        title: 'Skills',
                        content: (
                            <div className="grid grid-cols-4 gap-4">
                                {mergedData.skill?.map((skill, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                                        <p className="text-gray-700">{skill}</p>
                                    </div>
                                ))}
                            </div>
                        ),
                        condition: mergedData.skill?.length > 0
                    },
                    {
                        title: 'Experience',
                        content: mergedData.job_title?.map((title, index) => (
                            <div key={index}
                                className={`relative pl-4 border-l-4 border-${styles.primaryColor} ${styles.spacing.element} 
                  p-4 bg-white rounded-lg shadow-sm`}>
                                <h3 className={`${styles.fontSize.subtitle} font-semibold`}>{title}</h3>
                                <p className="text-gray-600">{mergedData.employer[index]}</p>
                                <p className="text-gray-500 text-sm">
                                    {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                </p>
                                <div className="mt-2 text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                        className="prose max-w-none" />
                                </div>
                            </div>
                        )),
                        condition: mergedData.job_title?.length > 0
                    },
                    {
                        title: 'Education',
                        content: mergedData.college?.map((college, index) => (
                            <div key={index}
                                className={`relative pl-4 border-l-4 border-${styles.primaryColor} ${styles.spacing.element} 
                  p-4 bg-white rounded-lg shadow-sm`}>
                                <h3 className={`${styles.fontSize.subtitle} font-semibold`}>
                                    {mergedData.degree[index]}
                                </h3>
                                <p className="text-gray-600">{college}</p>
                                <p className="text-gray-500 text-sm">
                                    {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                </p>
                                <div className="mt-2 text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                        className="prose max-w-none" />
                                </div>
                            </div>
                        )),
                        condition: mergedData.college?.length > 0
                    },
                    {
                        title: 'Certificates',
                        content: (
                            <div className="grid grid-cols-2 gap-4">
                                {mergedData.certificate_title?.map((title, index) => (
                                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <h3 className={`${styles.fontSize.subtitle} font-semibold mb-2`}>{title}</h3>
                                        <div className="text-gray-700">
                                            <div dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                                className="prose max-w-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ),
                        condition: mergedData.certificate_title?.length > 0
                    },
                    {
                        title: 'Internships',
                        content: mergedData.internship_title?.map((title, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                                <h3 className={`${styles.fontSize.subtitle} font-semibold mb-2`}>{title}</h3>
                                <div className="text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                        className="prose max-w-none" />
                                </div>
                            </div>
                        )),
                        condition: mergedData.internship_title?.length > 0
                    }
                ].map((section, index) => (
                    section.condition !== false && (
                        <div key={index} className={styles.spacing.section}>
                            <h2 className={`${styles.fontSize.title} text-${styles.primaryColor} 
                border-b-2 border-${styles.secondaryColor} pb-2 ${styles.spacing.element}`}>
                                {section.title}
                            </h2>
                            {section.content}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default CreativeTemplate;