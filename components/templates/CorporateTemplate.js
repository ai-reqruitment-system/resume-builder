import React from 'react';

const CorporateTemplate = ({
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
        '--primary': fontStyles.font_color || '#2563eb',
        '--text-primary': fontStyles.font_color || '#1f2937',
        '--text-secondary': fontStyles.font_color || '#4b5563',
        '--border-light': data.border_color || '#e5e7eb',
        '--bg-light': data.bg_light_color || '#f8fafc',
        '--bg-tag': data.bg_tag_color || '#f1f5f9',
    };

    return (
        <div
            className="w-full mx-auto bg-white p-2"
            style={{
                ...cssVariables,
                fontFamily: fontStyles.font_family || "'Inter', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: fontStyles.is_font_bold ? 'bold' : 'normal',
                fontStyle: fontStyles.is_font_italic ? 'italic' : 'normal',
                color: fontStyles.font_color
            }}
        >
            {/* Header Section */}
            <header className="mb-4 border-b-2 border-[var(--border-light)] pb-8 relative">
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--primary)]">
                    {`${mergedData.first_name || 'John'} ${mergedData.last_name || 'Doe'}`}
                </h1>
                <p className="text-xl text-[var(--text-secondary)] mb-6 font-medium">
                    {mergedData.occupation || 'Professional'}
                </p>
                <div className="mt-6 w-full table">
                    <div className="table-row">
            <span className="table-cell pr-8 py-2 text-[var(--text-secondary)] text-sm">
              {mergedData.email || 'email@example.com'}
            </span>
                        <span className="table-cell pr-8 py-2 text-[var(--text-secondary)] text-sm">
              {mergedData.phone || '+1 (555) 123-4567'}
            </span>
                        <span className="table-cell pr-8 py-2 text-[var(--text-secondary)] text-sm">
              {`${mergedData.city || 'City'}, ${mergedData.country || 'Country'}`}
            </span>
                        {mergedData.github && (
                            <span className="table-cell pr-8 py-2 font-mono text-sm">
                <a
                    href={mergedData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] no-underline"
                >
                  {`github.com/${mergedData.github.split('/').pop()}`}
                </a>
              </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Skills Section */}
            {mergedData.skill?.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                        Technical Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {mergedData.skill.map((skill, index) => (
                            <span
                                key={index}
                                className="px-5 py-3 bg-[var(--bg-tag)] border border-[var(--border-light)] rounded font-mono text-sm text-[var(--text-primary)]"
                            >
                {skill}
              </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {mergedData.job_title?.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {mergedData.job_title.map((title, index) => (
                            <div key={index} className="relative pl-8 border-l-2 border-[var(--border-light)]">
                                <div className="absolute w-2 h-2 bg-[var(--primary)] rounded-full -left-1 top-2" />
                                <div className="mb-2 font-mono text-sm text-[var(--primary)]">
                                    {`${mergedData.job_begin?.[index] || ''} - ${mergedData.job_end?.[index] || 'Present'}`}
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
                                <p className="text-base text-[var(--text-secondary)] mb-2 font-medium">
                                    {mergedData.employer?.[index] || ''}
                                </p>
                                {mergedData.job_description?.[index] && (
                                    <div
                                        className="text-[var(--text-secondary)]"
                                        dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education Section */}
            {mergedData.college?.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                        Education
                    </h2>
                    <div className="space-y-6">
                        {mergedData.college.map((college, index) => (
                            <div key={index} className="relative pl-8 border-l-2 border-[var(--border-light)]">
                                <div className="absolute w-2 h-2 bg-[var(--primary)] rounded-full -left-1 top-2" />
                                <div className="mb-2 font-mono text-sm text-[var(--primary)]">
                                    {`${mergedData.college_begin?.[index] || ''} - ${mergedData.college_end?.[index] || ''}`}
                                </div>
                                <h3 className="text-lg font-semibold">{mergedData.degree?.[index] || ''}</h3>
                                <p className="text-[var(--text-secondary)] mb-2">{college}</p>
                                {mergedData.college_description?.[index] && (
                                    <p
                                        className="font-mono text-sm"
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
                <section className="mb-4 break-inside-avoid">
                    <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                        Certifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mergedData.certificate_title.map((title, index) => (
                            <div key={index} className="p-6 bg-[var(--bg-light)] border border-[var(--border-light)] rounded">
                                <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">{title}</h3>
                                {mergedData.certificate_id?.[index] && (
                                    <p className="font-mono text-sm text-[var(--primary)] mb-3">
                                        {mergedData.certificate_id[index]}
                                    </p>
                                )}
                                {mergedData.certificate_issuer?.[index] && (
                                    <p className="text-base text-[var(--text-secondary)] font-medium">
                                        {mergedData.certificate_issuer[index]}
                                    </p>
                                )}
                                {mergedData.certificate_date?.[index] && (
                                    <p className="font-mono text-sm text-[var(--primary)]">
                                        {mergedData.certificate_date[index]}
                                    </p>
                                )}
                                {mergedData.certificate_description?.[index] && (
                                    <p
                                        className="text-[var(--text-secondary)] text-sm mt-3"
                                        dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Internships Section */}
            {mergedData.internship_title?.length > 0 && mergedData.internship_title[0] && (
                <section className="mb-4 break-inside-avoid">
                    <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                        Internships
                    </h2>
                    <div className="space-y-6">
                        {mergedData.internship_title.map((title, index) => (
                            title && (
                                <div key={index} className="relative pl-8 border-l-2 border-[var(--border-light)]">
                                    <div className="absolute w-2 h-2 bg-[var(--primary)] rounded-full -left-1 top-2" />
                                    <div className="mb-2 font-mono text-sm text-[var(--primary)]">
                                        {`${mergedData.internship_begin?.[index] || ''} - ${mergedData.internship_end?.[index] || ''}`}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
                                    <p className="text-base text-[var(--text-secondary)] mb-2 font-medium">
                                        {mergedData.internship_employer?.[index] || ''}
                                    </p>
                                    {mergedData.internship_summary?.[index] && (
                                        <div
                                            className="text-[var(--text-secondary)]"
                                            dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                        />
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </section>
            )}

            {/* Other Sections */}
            {mergedData.other_title?.map((title, index) => (
                title && (
                    <section key={index} className="mb-4 break-inside-avoid">
                        <h2 className="text-lg uppercase tracking-widest text-[var(--primary)] mb-6 pb-2 border-b border-[var(--border-light)] font-semibold">
                            {title}
                        </h2>
                        {mergedData.other_description?.[index] && (
                            <div
                                className="text-[var(--text-secondary)]"
                                dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                            />
                        )}
                    </section>
                )
            ))}
        </div>
    );
};

export default CorporateTemplate;