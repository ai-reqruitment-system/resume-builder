import React from 'react';

const DynamicTemplate = ({
    data = {},
    fontStyles = {},
    defaultData = {},
    isModalView = false,
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

    const mergedData = mergeDataWithDefaults(data, defaultData);

    const cssVariables = {
        '--primary': fontStyles.font_color || '#0f172a',
        '--secondary': fontStyles.font_color || '#334155',
        '--accent': data.accent_color || '#6366f1',
        '--accent-soft': data.accent_soft || '#818cf8',
        '--success': data.success_color || '#10b981',
        '--warning': data.warning_color || '#f59e0b',
        '--surface-1': data.surface_1 || '#ffffff',
        '--surface-2': data.surface_2 || '#f8fafc',
        '--text-1': data.text_1 || '#1e293b',
        '--text-2': data.text_2 || '#475569',
        '--border': data.border_color || '#e2e8f0',
    };

    const sidebarHeadingClasses = "text-[var(--accent-soft)] text-lg uppercase tracking-wider mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--accent-soft)] after:opacity-30";
    const sectionTitleClasses = "text-3xl text-[var(--primary)] mb-8 pb-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[60px] after:h-1 after:bg-[var(--accent)] after:rounded";
    const cardBaseClasses = "p-6 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] transition-all duration-300";

    return (
        <div
            className="grid grid-cols-[380px_1fr] min-h-[297mm] relative bg-[var(--surface-1)]"
            style={{
                ...cssVariables,
                fontFamily: fontStyles.font_family || "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: fontStyles.is_font_bold ? 'bold' : 'normal',
                fontStyle: fontStyles.is_font_italic ? 'italic' : 'normal',
                color: fontStyles.font_color,
            }}
        >
            {/* Sidebar */}
            <div className="bg-[var(--primary)] p-10 relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />

                {/* Profile Section */}
                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-4xl font-extrabold text-[var(--surface-1)] mb-2 tracking-tight">
                        {`${mergedData.first_name || 'John'} ${mergedData.last_name || 'Doe'}`}
                    </h1>
                    <p className="text-[var(--accent-soft)] text-lg font-medium">
                        {mergedData.professional_summary || 'Professional'}
                    </p>
                </div>

                {/* Contact Section */}
                <div className="mb-9 relative z-10">
                    <h2 className={sidebarHeadingClasses}>Contact</h2>
                    <ul className="space-y-4">
                        {mergedData.email && (
                            <li className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-lg hover:bg-white/[0.08] hover:translate-x-1 transition-all duration-300">
                                <span className="w-9 h-9 flex items-center justify-center bg-[var(--accent)] text-white rounded-lg">
                                    <i className="fas fa-envelope" />
                                </span>
                                <span className="text-[var(--surface-1)] text-[0.95rem]">{mergedData.email}</span>
                            </li>
                        )}
                        {mergedData.phone && (
                            <li className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-lg hover:bg-white/[0.08] hover:translate-x-1 transition-all duration-300">
                                <span className="w-9 h-9 flex items-center justify-center bg-[var(--accent)] text-white rounded-lg">
                                    <i className="fas fa-phone" />
                                </span>
                                <span className="text-[var(--surface-1)] text-[0.95rem]">{mergedData.phone}</span>
                            </li>
                        )}
                        {(mergedData.city || mergedData.country) && (
                            <li className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-lg hover:bg-white/[0.08] hover:translate-x-1 transition-all duration-300">
                                <span className="w-9 h-9 flex items-center justify-center bg-[var(--accent)] text-white rounded-lg">
                                    <i className="fas fa-map-marker-alt" />
                                </span>
                                <span className="text-[var(--surface-1)] text-[0.95rem]">
                                    {`${mergedData.city || ''}${mergedData.city && mergedData.country ? ', ' : ''}${mergedData.country || ''}`}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Skills Section */}
                {mergedData.skill?.length > 0 && (
                    <div className="mb-9 relative z-10">
                        <h2 className={sidebarHeadingClasses}>Expertise</h2>
                        {mergedData.skill.map((skill, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[var(--surface-1)] text-[0.95rem]">{skill}</span>
                                    <span className="text-[var(--accent-soft)] text-[0.9rem]">{95 - (index * 10)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] rounded relative"
                                        style={{ width: `${95 - (index * 10)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Languages Section */}
                {mergedData.language?.length > 0 && (
                    <div className="relative z-10">
                        <h2 className={sidebarHeadingClasses}>Languages</h2>
                        {mergedData.language.map((language, index) => (
                            <div key={index} className="mb-3 text-[var(--surface-1)] text-[0.95rem]">
                                {language}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="p-12 bg-[var(--surface-1)]">
                {/* About Section */}
                {mergedData.professional_description && (
                    <section className="mb-10">
                        <h2 className={sectionTitleClasses}>About Me</h2>
                        <div
                            className="text-[var(--text-2)] text-[0.95rem] leading-7"
                            dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        />
                    </section>
                )}

                {/* Experience Section */}
                {mergedData.job_title?.length > 0 && (
                    <section className="mb-10">
                        <h2 className={sectionTitleClasses}>Professional Experience</h2>
                        {mergedData.job_title.map((title, index) => (
                            title && (
                                <div key={index} className={`${cardBaseClasses} mb-6 hover:-translate-y-1 hover:shadow-lg relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[var(--accent)] before:rounded-l-2xl`}>
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">{title}</h3>
                                            <p className="text-lg text-[var(--accent)]">{mergedData.employer?.[index] || ''}</p>
                                        </div>
                                        <span className="flex items-center gap-2 bg-[var(--accent)] text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                            <i className="fas fa-calendar-alt text-[0.8rem]" />
                                            {`${mergedData.job_begin?.[index] || ''} - ${mergedData.job_end?.[index] || 'Present'}`}
                                        </span>
                                    </div>
                                    {mergedData.job_description?.[index] && (
                                        <div
                                            className="text-[var(--text-2)] text-[0.95rem] leading-7 mb-4"
                                            dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                        />
                                    )}
                                </div>
                            )
                        ))}
                    </section>
                )}

                {/* Education Section */}
                {mergedData.college?.length > 0 && (
                    <section className="mb-10">
                        <h2 className={sectionTitleClasses}>Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {mergedData.college.map((college, index) => (
                                <div key={index} className={`${cardBaseClasses} hover:translate-x-1 hover:shadow-lg`}>
                                    <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
                                        {mergedData.degree?.[index] || ''}
                                    </h3>
                                    <p className="text-[var(--accent)] mb-3">{college}</p>
                                    <span className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                                        <i className="fas fa-calendar-alt" />
                                        {`${mergedData.college_begin?.[index] || ''} - ${mergedData.college_end?.[index] || ''}`}
                                    </span>
                                    {mergedData.college_description?.[index] && (
                                        <div
                                            className="mt-3 text-[var(--text-2)] text-[0.95rem]"
                                            dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates Section */}
                {mergedData.certificate_title?.length > 0 && (
                    <section className="mb-10">
                        <h2 className={sectionTitleClasses}>Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {mergedData.certificate_title.map((title, index) => (
                                <div key={index} className={`${cardBaseClasses} hover:-translate-y-1 hover:shadow-lg relative`}>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]" />
                                    <h3 className="text-lg font-semibold text-[var(--text-1)] mb-3">{title}</h3>
                                    {mergedData.certificate_description?.[index] && (
                                        <div
                                            className="text-[var(--text-2)] text-[0.95rem] leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }

                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    .grid {
                        display: grid !important;
                    }

                    section {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
};

export default DynamicTemplate;