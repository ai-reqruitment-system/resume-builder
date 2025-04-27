import React from 'react';

const ProfessionalTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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

    // Color settings - using blue gradient from HTML template
    const mainColor = fontStyles.font_color || "#4A90E2"; // Blue color from HTML
    const secondaryColor = "#3A7BC8"; // Slightly darker blue
    const accentColor = "#E6F0FD"; // Light blue background

    // Calculate years of experience (approximate)
    const calculateTotalYears = () => {
        if (!mergedData.job_begin || !mergedData.job_end || mergedData.job_begin.length === 0) return 0;

        let totalMonths = 0;

        mergedData.job_begin.forEach((begin, index) => {
            const end = mergedData.job_end[index];
            if (!begin || !end) return;

            const beginParts = begin.split('/');
            const endParts = end.split('/');

            if (beginParts.length >= 2 && endParts.length >= 2) {
                const beginYear = parseInt(beginParts[1]);
                const beginMonth = parseInt(beginParts[0]);

                let endYear = parseInt(endParts[1]);
                let endMonth = parseInt(endParts[0]);

                // If "Present" or current year, use current date
                if (isNaN(endYear) || isNaN(endMonth)) {
                    const now = new Date();
                    endYear = now.getFullYear();
                    endMonth = now.getMonth() + 1;
                }

                totalMonths += (endYear - beginYear) * 12 + (endMonth - beginMonth);
            }
        });

        return Math.max(Math.floor(totalMonths / 12), 1);
    };

    const yearsExperience = calculateTotalYears();

    // SVG Icons for contact information
    const emailIcon = (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/>
        </svg>
    );

    const phoneIcon = (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92V19.92C22 20.5 21.8 20.9 21.4 21.2C21 21.6 20.6 21.7 20.1 21.7C18.8 21.6 17.3 21.1 15.9 20.4C14.4 19.6 13.1 18.5 11.9 17.3C10.7 16.1 9.6 14.8 8.8 13.3C8.1 11.9 7.6 10.4 7.5 9.1C7.5 8.6 7.6 8.2 8 7.8C8.3 7.4 8.7 7.2 9.3 7.2H12.3C12.7 7.2 13.1 7.3 13.4 7.5C13.7 7.7 13.9 8 14 8.3L14.5 10.1C14.6 10.4 14.5 10.7 14.4 11C14.3 11.3 14.1 11.5 13.9 11.7L12.6 13C13.3 14.2 14.1 15.3 15.1 16.2C16 17.2 17.1 18 18.3 18.7L19.6 17.4C19.8 17.2 20 17 20.3 16.9C20.6 16.8 20.9 16.7 21.2 16.8L23 17.3C23.3 17.4 23.6 17.6 23.8 17.9C24 18.2 24.1 18.6 24.1 19V22C24 22.35 23.88 22.69 23.65 22.94C23.42 23.19 23.1 23.33 22.75 23.34C19.5 23.55 16.33 22.47 13.8 20.3C11.27 18.13 9.64 15.07 9.3 11.8C9.19 10.74 9.31 9.67 9.66 8.66C10.01 7.65 10.58 6.73 11.31 5.97C12.05 5.21 12.94 4.63 13.92 4.28C14.91 3.93 15.96 3.81 17 3.94H22C22.3 3.94 22.58 4.05 22.79 4.26C23 4.47 23.11 4.75 23.11 5.04C23.12 9.11 21.97 13.08 19.8 16.43L22 16.92Z"/>
        </svg>
    );

    const locationIcon = (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    );

    return (
        <div className="bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white shadow-lg">
                    {/* Header Section with Profile */}
                    <div
                        className="flex flex-col md:flex-row p-6 md:p-8"
                        style={{
                            background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                            color: "white",
                            fontFamily: fontStyles.font_family,
                            fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                            fontStyle: fontStyles.is_font_italic ? "italic" : "normal"
                        }}
                    >
                        {/* Profile Photo (placeholder) */}
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex justify-center">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-md bg-gray-200">
                                {/* This is a placeholder for the profile photo */}
                                <img
                                    src={"profile-placeholder.jpg"}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Header Content */}
                        <div className="flex-1">
                            <h1 className={`${isModalView ? 'text-4xl' : 'text-3xl'} font-bold tracking-tight mb-1`}>
                                {`${mergedData.first_name} ${mergedData.last_name}`}
                            </h1>
                            <p className={`${isModalView ? 'text-xl' : 'text-lg'} opacity-90 font-light mb-4`}>
                                {mergedData.professional_summary}
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-wrap mt-4">
                                <div className="flex items-center mr-6 mb-2">
                                    {emailIcon}
                                    <span>{mergedData.email}</span>
                                </div>
                                <div className="flex items-center mr-6 mb-2">
                                    {phoneIcon}
                                    <span>{mergedData.phone}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    {locationIcon}
                                    <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 md:p-10">
                        {/* Professional Summary */}
                        {mergedData.professional_description && (
                            <div className="mb-8 bg-gray-50 p-5 border-l-4" style={{ borderColor: mainColor }}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                    className="prose max-w-none text-gray-700"
                                />
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Column - 35% */}
                            <div className="md:w-1/3 space-y-8">
                                {/* Education Panel */}
                                {mergedData.college && mergedData.college.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Education
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="space-y-4">
                                            {mergedData.college.map((college, index) => (
                                                <div key={index} className="relative pl-7 pb-6 last:pb-0">
                                                    {/* Timeline dot and line */}
                                                    <div
                                                        className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full"
                                                        style={{ backgroundColor: mainColor }}
                                                    ></div>

                                                    {index < mergedData.college.length - 1 && (
                                                        <div
                                                            className="absolute left-[7px] top-6 bottom-0 w-px"
                                                            style={{ backgroundColor: mainColor }}
                                                        ></div>
                                                    )}

                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3
                                                            className="text-base font-semibold"
                                                            style={{ color: secondaryColor }}
                                                        >
                                                            {mergedData.degree[index]}
                                                        </h3>
                                                        <span
                                                            className="text-xs text-white px-2 py-1 rounded"
                                                            style={{ backgroundColor: mainColor }}
                                                        >
                                                            {`${mergedData.college_begin[index]}-${mergedData.college_end[index]}`}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mb-2" style={{ color: mainColor }}>
                                                        {college}
                                                    </p>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                                        className="prose prose-sm max-w-none text-gray-600"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills Panel */}
                                {mergedData.skill && mergedData.skill.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Skills
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="flex flex-wrap gap-2">
                                            {mergedData.skill.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block px-3 py-1 rounded text-sm mb-2"
                                                    style={{
                                                        backgroundColor: mainColor,
                                                        color: 'white'
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Languages Panel */}
                                {mergedData.language && mergedData.language.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Languages
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="space-y-3">
                                            {mergedData.language.map((language, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-700">{language}</span>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-2 h-2 rounded-full mx-0.5"
                                                                style={{
                                                                    backgroundColor: i < 5 - (index % 2) ? mainColor : '#E5E7EB',
                                                                    opacity: i < 5 - (index % 2) ? 1 - (i * 0.15) : 0.3
                                                                }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certificates Panel */}
                                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Certifications
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="flex flex-wrap gap-2">
                                            {mergedData.certificate_title.map((title, index) => (
                                                <div key={index} className="w-full mb-3">
                                                    <span
                                                        className="inline-block px-3 py-1 rounded text-sm mb-1"
                                                        style={{
                                                            backgroundColor: mainColor,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {title}
                                                    </span>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                                        className="prose prose-sm max-w-none text-gray-600 mt-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - 65% */}
                            <div className="md:w-2/3 space-y-8">
                                {/* Experience Panel */}
                                {mergedData.job_title && mergedData.job_title.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Professional Experience
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="space-y-8">
                                            {mergedData.job_title.map((title, index) => (
                                                <div key={index} className="relative pl-7 pb-8 last:pb-0">
                                                    {/* Timeline dot and line */}
                                                    <div
                                                        className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full"
                                                        style={{ backgroundColor: mainColor }}
                                                    ></div>

                                                    {index < mergedData.job_title.length - 1 && (
                                                        <div
                                                            className="absolute left-[7px] top-6 bottom-0 w-px"
                                                            style={{ backgroundColor: mainColor }}
                                                        ></div>
                                                    )}

                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                                        <div>
                                                            <h3
                                                                className="text-lg font-semibold"
                                                                style={{ color: secondaryColor }}
                                                            >
                                                                {title}
                                                            </h3>
                                                            <p
                                                                className="text-sm mb-2"
                                                                style={{ color: mainColor }}
                                                            >
                                                                {mergedData.employer[index]}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className="text-xs text-white px-2 py-1 rounded mt-1 md:mt-0"
                                                            style={{ backgroundColor: mainColor }}
                                                        >
                                                            {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                                        </span>
                                                    </div>

                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                                        className="prose max-w-none text-gray-700"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Internships Panel */}
                                {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                                    <div className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            Internship Experience
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {mergedData.internship_title.map((title, index) => (
                                                <div
                                                    key={index}
                                                    className="relative pl-7 pb-4 last:pb-0"
                                                >
                                                    {/* Timeline dot */}
                                                    <div
                                                        className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full"
                                                        style={{ backgroundColor: mainColor }}
                                                    ></div>

                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3
                                                            className="text-base font-semibold"
                                                            style={{ color: secondaryColor }}
                                                        >
                                                            {title}
                                                        </h3>
                                                    </div>

                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                                        className="prose prose-sm max-w-none text-gray-700"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Sections Panel */}
                                {mergedData.other_title && mergedData.other_title.map((title, index) => (
                                    <div key={index} className="mb-8">
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 pb-2 uppercase`}
                                            style={{
                                                color: mainColor,
                                                borderBottom: `2px solid ${mainColor}`,
                                                position: 'relative'
                                            }}
                                        >
                                            {title}
                                            <span
                                                className="absolute left-0 bottom-[-2px] w-20 h-0.5"
                                                style={{ backgroundColor: mainColor }}
                                            ></span>
                                        </h2>

                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                                            className="prose max-w-none text-gray-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTemplate;