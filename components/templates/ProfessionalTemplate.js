import React from 'react';

const ProfessionalTemplate = ({
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
        '--gradient-start': data.gradient_start || '#1a365d',
        '--gradient-end': data.gradient_end || '#2d3748',
        '--accent': data.accent_color || '#60a5fa',
        '--accent-light': data.accent_light || '#93c5fd',
        '--text-light': '#ffffff',
        '--text-dark': fontStyles.font_color || '#1a202c',
        '--text-muted': data.muted_color || '#64748b',
        '--background': data.bg_color || '#ffffff',
        '--surface': data.surface_color || '#f8fafc',
        '--border': data.border_color || '#e2e8f0',
        '--shadow': 'rgba(0, 0, 0, 0.1)',
    };

    return (
        <div
            className="min-h-[297mm] flex"
            style={{
                ...cssVariables,
                fontFamily: fontStyles.font_family || "'Poppins', -apple-system, sans-serif",
                fontWeight: fontStyles.is_font_bold ? 'bold' : 'normal',
                fontStyle: fontStyles.is_font_italic ? 'italic' : 'normal',
                background: 'var(--background)',
                color: 'var(--text-dark)',
            }}
        >
            {/* Sidebar */}
            <div
                className="w-[300px] p-10 relative overflow-hidden text-[var(--text-light)]"
                style={{
                    background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                }}
            >
                {/* Contact Section */}
                <div className="mb-8 pb-5 border-b border-white/10">
                    <h2 className="text-lg uppercase tracking-wider mb-5 pl-4 relative text-[var(--accent-light)] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-[var(--accent)] before:rounded">
                        Contact
                    </h2>
                    <ul className="space-y-4">
                        {mergedData.email && (
                            <li className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all duration-300">
                                <span className="w-8 h-8 flex items-center justify-center bg-[var(--accent)] rounded-md shadow mr-3 text-sm">
                                    <i className="fas fa-envelope" />
                                </span>
                                <span className="text-sm opacity-90">{mergedData.email}</span>
                            </li>
                        )}
                        {mergedData.phone && (
                            <li className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all duration-300">
                                <span className="w-8 h-8 flex items-center justify-center bg-[var(--accent)] rounded-md shadow mr-3 text-sm">
                                    <i className="fas fa-phone" />
                                </span>
                                <span className="text-sm opacity-90">{mergedData.phone}</span>
                            </li>
                        )}
                        {(mergedData.city || mergedData.country) && (
                            <li className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all duration-300">
                                <span className="w-8 h-8 flex items-center justify-center bg-[var(--accent)] rounded-md shadow mr-3 text-sm">
                                    <i className="fas fa-map-marker-alt" />
                                </span>
                                <span className="text-sm opacity-90">
                                    {`${mergedData.city || ''}${mergedData.city && mergedData.country ? ', ' : ''}${mergedData.country || ''}`}
                                </span>
                            </li>
                        )}
                        {mergedData.website && (
                            <li className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all duration-300">
                                <span className="w-8 h-8 flex items-center justify-center bg-[var(--accent)] rounded-md shadow mr-3 text-sm">
                                    <i className="fas fa-globe" />
                                </span>
                                <span className="text-sm opacity-90">{mergedData.website}</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Skills Section */}
                {mergedData.skill?.length > 0 && (
                    <div className="mb-8 pb-5 border-b border-white/10">
                        <h2 className="text-lg uppercase tracking-wider mb-5 pl-4 relative text-[var(--accent-light)] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-[var(--accent)] before:rounded">
                            Skills
                        </h2>
                        <ul className="space-y-4">
                            {mergedData.skill.map((skill, index) => (
                                <li key={index} className="text-sm opacity-90">{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Languages Section */}
                {mergedData.language?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg uppercase tracking-wider mb-5 pl-4 relative text-[var(--accent-light)] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-[var(--accent)] before:rounded">
                            Languages
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {mergedData.language.map((language, index) => (
                                <div key={index} className="text-center p-4 rounded-lg border border-white/10 text-sm">
                                    {language}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12 bg-[var(--background)]">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-semibold mb-2">
                        {`${mergedData.first_name || 'John'} ${mergedData.last_name || 'Doe'}`}
                    </h1>
                    <p className="text-xl text-[var(--text-muted)] mb-6">
                        {mergedData.professional_summary || 'Professional'}
                    </p>
                    {mergedData.professional_description && (
                        <div
                            className="text-[var(--text-muted)]"
                            dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        />
                    )}
                </header>

                {/* Experience Section */}
                {mergedData.job_title?.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl mb-6 pb-2 relative inline-block text-[var(--text-dark)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[var(--accent)] after:to-transparent">
                            Work Experience
                        </h2>
                        {mergedData.job_title.map((title, index) => (
                            title && (
                                <div key={index} className="mb-6 p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1 text-[var(--text-dark)]">{title}</h3>
                                            <p className="text-lg text-[var(--accent)]">{mergedData.employer?.[index] || ''}</p>
                                        </div>
                                        <span className="px-3 py-1.5 bg-[var(--accent)] text-white rounded-full text-sm">
                                            {`${mergedData.job_begin?.[index] || ''} - ${mergedData.job_end?.[index] || 'Present'}`}
                                        </span>
                                    </div>
                                    {mergedData.job_description?.[index] && (
                                        <div
                                            className="text-[var(--text-muted)] leading-relaxed"
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
                    <section className="mb-12">
                        <h2 className="text-2xl mb-6 pb-2 relative inline-block text-[var(--text-dark)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[var(--accent)] after:to-transparent">
                            Education
                        </h2>
                        {mergedData.college.map((college, index) => (
                            <div key={index} className="mb-6 p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:translate-x-1 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-semibold mb-1 text-[var(--text-dark)]">
                                    {mergedData.degree?.[index] || ''}
                                </h3>
                                <p className="text-lg text-[var(--accent)] mb-2">{college}</p>
                                <p className="text-sm text-[var(--text-muted)] mb-4">
                                    {`${mergedData.college_begin?.[index] || ''} - ${mergedData.college_end?.[index] || ''}`}
                                </p>
                                {mergedData.college_description?.[index] && (
                                    <div
                                        className="text-[var(--text-muted)]"
                                        dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>

            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    section {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfessionalTemplate