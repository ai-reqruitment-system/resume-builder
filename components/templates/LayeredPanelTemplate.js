const LayeredPanelTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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
    const mainColor = fontStyles.font_color || "#047857"; // Emerald-700
    const secondaryColor = "#065F46"; // Emerald-800
    const accentColor = "#ECFDF5"; // Emerald-50

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

    return (
        <div className="bg-white">
            {/* Background Layer */}
            <div className="relative w-full min-h-screen">
                {/* Fixed background color panel */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1/3 h-full bg-green-50"
                    style={{
                        zIndex: 0
                    }}
                ></div>

                {/* Content container */}
                <div
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    style={{
                        fontFamily: fontStyles.font_family,
                        color: "#1F2937", // Gray-800
                        fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                        fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    }}
                >
                    {/* Header Card */}
                    <div className="pt-12 pb-6">
                        <div
                            className="bg-white rounded-lg shadow-md p-8 mx-auto"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                                {/* Name and role */}
                                <div>
                                    <h1
                                        className={`${isModalView ? 'text-4xl' : 'text-3xl'} font-bold tracking-tight mb-2`}
                                        style={{ color: mainColor }}
                                    >
                                        {`${mergedData.first_name} ${mergedData.last_name}`}
                                    </h1>
                                    <p className={`${isModalView ? 'text-xl' : 'text-lg'} text-gray-600 font-medium`}>
                                        {mergedData.occupation}
                                    </p>
                                </div>

                                {/* Experience stats block */}
                                <div
                                    className="mt-4 md:mt-0 py-2 px-4 rounded-md inline-flex"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <div className="text-center px-4 border-r border-gray-200">
                                        <div className="font-bold text-2xl" style={{ color: secondaryColor }}>
                                            {yearsExperience}+
                                        </div>
                                        <div className="text-xs text-gray-600 uppercase tracking-wide">Years Exp</div>
                                    </div>

                                    <div className="text-center px-4">
                                        <div className="font-bold text-2xl" style={{ color: secondaryColor }}>
                                            {mergedData.skill ? mergedData.skill.length : 0}+
                                        </div>
                                        <div className="text-xs text-gray-600 uppercase tracking-wide">Skills</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact info row */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                  <span
                      className="mr-2 text-xs"
                      style={{ color: mainColor }}
                  >●</span>
                                    <span>{mergedData.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                  <span
                      className="mr-2 text-xs"
                      style={{ color: mainColor }}
                  >●</span>
                                    <span>{mergedData.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                  <span
                      className="mr-2 text-xs"
                      style={{ color: mainColor }}
                  >●</span>
                                    <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                                </div>
                            </div>

                            {/* Professional Summary */}
                            {mergedData.professional_description && (
                                <div>
                                    <h2
                                        className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-3 uppercase tracking-wide flex items-center`}
                                        style={{ color: mainColor }}
                                    >
                    <span
                        className="inline-block w-5 h-0.5 mr-2"
                        style={{ backgroundColor: mainColor }}
                    ></span>
                                        About Me
                                    </h2>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                                        className="prose max-w-none text-gray-700"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="pb-12">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left column */}
                            <div className="md:w-1/3 space-y-6">
                                {/* Skills Panel */}
                                {mergedData.skill && mergedData.skill.length > 0 && (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Skills
                                        </h2>

                                        <div className="flex flex-wrap gap-2">
                                            {mergedData.skill.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                                    style={{
                                                        backgroundColor: accentColor,
                                                        color: secondaryColor
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
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Languages
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
                                                                    backgroundColor: i < 5-(index % 2) ? mainColor : '#E5E7EB',
                                                                    opacity: i < 5-(index % 2) ? 1 - (i * 0.2) : 0.3
                                                                }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education Panel */}
                                {mergedData.college && mergedData.college.length > 0 && (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Education
                                        </h2>

                                        <div className="space-y-5">
                                            {mergedData.college.map((college, index) => (
                                                <div key={index} className="pb-5 last:pb-0 last:border-b-0 border-b border-gray-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3
                                                            className="text-base font-semibold"
                                                            style={{ color: secondaryColor }}
                                                        >
                                                            {mergedData.degree[index]}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                              {`${mergedData.college_begin[index]}-${mergedData.college_end[index]}`}
                            </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{college}</p>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                                        className="prose prose-sm max-w-none text-gray-600"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certificates Panel */}
                                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Certifications
                                        </h2>

                                        <div className="space-y-3">
                                            {mergedData.certificate_title.map((title, index) => (
                                                <div key={index} className="pb-3 last:pb-0 border-b last:border-b-0 border-gray-100">
                                                    <h3 className="text-sm font-semibold mb-1">{title}</h3>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                                        className="prose prose-sm max-w-none text-gray-600"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right column */}
                            <div className="md:w-2/3 space-y-6">
                                {/* Experience Panel */}
                                {mergedData.job_title && mergedData.job_title.length > 0 && (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Professional Experience
                                        </h2>

                                        <div className="space-y-8">
                                            {mergedData.job_title.map((title, index) => (
                                                <div key={index} className="relative">
                                                    {/* Year marker */}
                                                    <div
                                                        className="absolute left-0 top-0 w-16 py-1 rounded-md text-xs font-medium text-center"
                                                        style={{
                                                            backgroundColor: accentColor,
                                                            color: secondaryColor
                                                        }}
                                                    >
                                                        {mergedData.job_begin[index].split('/')[1] || mergedData.job_begin[index]}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="ml-20 pb-8 relative">
                                                        {/* Vertical connecting line */}
                                                        {index < mergedData.job_title.length - 1 && (
                                                            <div
                                                                className="absolute left-[-12px] top-8 bottom-0 w-px"
                                                                style={{ backgroundColor: `${mainColor}30` }}
                                                            ></div>
                                                        )}

                                                        <h3
                                                            className="text-lg font-bold mb-1"
                                                            style={{ color: secondaryColor }}
                                                        >
                                                            {title}
                                                        </h3>
                                                        <p className="text-sm font-medium text-gray-600 mb-3">
                                                            {`${mergedData.employer[index]} | ${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                                        </p>
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                                            className="prose max-w-none text-gray-700"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Internships Panel */}
                                {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-6 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            Internships
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {mergedData.internship_title.map((title, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-100 rounded-md p-4 hover:shadow-sm transition-shadow duration-200"
                                                >
                                                    <h3
                                                        className="text-base font-semibold mb-2 pb-2 border-b"
                                                        style={{ borderColor: `${mainColor}30`, color: secondaryColor }}
                                                    >
                                                        {title}
                                                    </h3>
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
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-md p-6"
                                        style={{ borderTop: `3px solid ${mainColor}` }}
                                    >
                                        <h2
                                            className={`${isModalView ? 'text-lg' : 'text-base'} font-bold mb-4 uppercase tracking-wide flex items-center`}
                                            style={{ color: mainColor }}
                                        >
                      <span
                          className="inline-block w-5 h-0.5 mr-2"
                          style={{ backgroundColor: mainColor }}
                      ></span>
                                            {title}
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

export default LayeredPanelTemplate;