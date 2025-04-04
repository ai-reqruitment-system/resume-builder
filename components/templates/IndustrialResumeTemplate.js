import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faMapMarkerAlt, faUserHardHat,
    faIndustry, faTools, faCertificate, faGraduationCap,
    faPlusCircle, faLanguage, faAward, faStar,
    faChartLine, faShieldAlt, faCheckCircle, faCogs
} from '@fortawesome/free-solid-svg-icons';

const IndustrialResumeTemplate = ({  data = {},
                                      fontStyles = {},
                                      defaultData = {},
                                      isModalView = false, }) => {
    // Function to render HTML content safely
    const renderHTML = (html) => {
        return { __html: html };
    };
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
    // Define colors from the data or use defaults
    const primaryColor = fontStyles.font_color || '#0f172a';
    const secondaryColor = data?.secondary_color || '#475569';
    const accentColor = data?.accent_color || '#f59e0b';
    const surfaceColor = data?.surface_color || '#f8fafc';
    const successColor = data?.success_color || '#16a34a';
    const borderColor = data?.border_color || '#e2e8f0';

    return (
        <div
            className="mx-auto bg-white shadow-lg relative max-w-4xl"
            style={{
                fontFamily: fontStyles?.font_family || 'Roboto Condensed, -apple-system, sans-serif',
                fontWeight: fontStyles?.is_font_bold ? 'bold' : 'normal',
                fontStyle: fontStyles?.is_font_italic ? 'italic' : 'normal',
                color: primaryColor,
            }}
        >
            {/* Header */}
            <header
                className="relative overflow-hidden p-10 text-white"
                style={{ background: primaryColor }}
            >
                {/* Diagonal pattern overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `repeating-linear-gradient(
              45deg,
              rgba(0,0,0,0.1),
              rgba(0,0,0,0.1) 10px,
              transparent 10px,
              transparent 20px
            )`
                    }}
                ></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2 uppercase tracking-wider">
                        {data?.first_name || 'John'} {data?.last_name || 'Doe'}
                    </h1>
                    <p
                        className="text-2xl mb-5 font-medium"
                        style={{ color: accentColor }}
                    >
                        {data?.occupation || 'Industrial Professional'}
                    </p>

                    {/* Contact info */}
                    <table className="w-full mt-5 pt-5 border-t border-white border-opacity-10">
                        <tbody>
                        <tr>
                            {data?.email && (
                                <td className="py-2 pr-4 align-middle">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="w-5 text-center pr-2"
                                        style={{ color: accentColor }}
                                    />
                                    <span className="text-sm">{data.email}</span>
                                </td>
                            )}
                            {data?.phone && (
                                <td className="py-2 pr-4 align-middle">
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        className="w-5 text-center pr-2"
                                        style={{ color: accentColor }}
                                    />
                                    <span className="text-sm">{data.phone}</span>
                                </td>
                            )}
                            {(data?.city || data?.country) && (
                                <td className="py-2 pr-4 align-middle">
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="w-5 text-center pr-2"
                                        style={{ color: accentColor }}
                                    />
                                    <span className="text-sm">
                      {data?.city || ''}
                                        {data?.city && data?.country ? ', ' : ''}
                                        {data?.country || ''}
                    </span>
                                </td>
                            )}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </header>

            <div className="p-10">
                {/* Professional Summary */}
                {data?.professional_description && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faUserHardHat} className="mr-2" />
                            Professional Summary
                        </h2>
                        <p dangerouslySetInnerHTML={renderHTML(data.professional_description)}></p>
                    </section>
                )}

                {/* Experience */}
                {data?.job_title && data?.job_title.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faIndustry} className="mr-2" />
                            Professional Experience
                        </h2>

                        {data.job_title.map((title, index) => (
                            title && (
                                <div
                                    className="mb-6 p-5 relative border"
                                    style={{ borderColor }}
                                    key={`job-${index}`}
                                >
                                    {/* Gradient line at top */}
                                    <div
                                        className="absolute top-0 left-0 w-full h-1"
                                        style={{
                                            background: `linear-gradient(to right, ${accentColor}, transparent)`
                                        }}
                                    ></div>

                                    <h3
                                        className="text-lg font-semibold mb-1 uppercase"
                                        style={{ color: primaryColor }}
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className="text-base mb-2"
                                        style={{ color: secondaryColor }}
                                    >
                                        {data.employer?.[index] || ''}
                                    </p>

                                    <span
                                        className="inline-block px-3 py-1 rounded text-sm mb-4"
                                        style={{ background: surfaceColor, color: secondaryColor }}
                                    >
                    {data.job_begin?.[index] || ''} - {data.job_end?.[index] || 'Present'}
                  </span>

                                    {data.job_description?.[index] && (
                                        <div dangerouslySetInnerHTML={renderHTML(data.job_description[index])}></div>
                                    )}
                                </div>
                            )
                        ))}
                    </section>
                )}

                {/* Technical Skills */}
                {data?.skill && data?.skill.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faTools} className="mr-2" />
                            Technical Skills
                        </h2>

                        <div
                            className="p-5 rounded"
                            style={{ background: surfaceColor }}
                        >
                            <h3
                                className="text-lg uppercase mb-4"
                                style={{ color: primaryColor }}
                            >
                                <FontAwesomeIcon
                                    icon={faCogs}
                                    className="mr-2"
                                    style={{ color: accentColor }}
                                />
                                Core Competencies
                            </h3>

                            <ul className="list-none">
                                {data.skill.map((skill, index) => (
                                    <li
                                        className="mb-2 pl-5 relative"
                                        key={`skill-${index}`}
                                    >
                    <span
                        className="absolute left-0 top-0"
                        style={{ color: accentColor }}
                    >
                      ▸
                    </span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {data?.certificate_title && data?.certificate_title.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faCertificate} className="mr-2" />
                            Certifications & Licenses
                        </h2>

                        <div className="space-y-4">
                            {data.certificate_title.map((title, index) => (
                                <div
                                    className="p-4 rounded"
                                    style={{ background: surfaceColor }}
                                    key={`cert-${index}`}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded text-white"
                                            style={{ background: accentColor }}
                                        >
                                            <FontAwesomeIcon icon={faAward} />
                                        </div>

                                        <div className="ml-4">
                                            <h3 className="font-semibold mb-1">{title}</h3>
                                            {data.certificate_description?.[index] && (
                                                <p
                                                    className="text-sm"
                                                    style={{ color: secondaryColor }}
                                                    dangerouslySetInnerHTML={renderHTML(data.certificate_description[index])}
                                                ></p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {data?.college && data?.college.length > 0 && data?.college[0] && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                            Education
                        </h2>

                        {data.college.map((college, index) => (
                            <div
                                className="mb-6 p-5 relative border"
                                style={{ borderColor }}
                                key={`edu-${index}`}
                            >
                                {/* Gradient line at top */}
                                <div
                                    className="absolute top-0 left-0 w-full h-1"
                                    style={{
                                        background: `linear-gradient(to right, ${accentColor}, transparent)`
                                    }}
                                ></div>

                                <h3
                                    className="text-lg font-semibold mb-1 uppercase"
                                    style={{ color: primaryColor }}
                                >
                                    {data.degree?.[index] || ''}
                                </h3>

                                <p
                                    className="text-base mb-2"
                                    style={{ color: secondaryColor }}
                                >
                                    {college}
                                </p>

                                <span
                                    className="inline-block px-3 py-1 rounded text-sm mb-4"
                                    style={{ background: surfaceColor, color: secondaryColor }}
                                >
                  {data.college_begin?.[index] || ''} - {data.college_end?.[index] || ''}
                </span>

                                {data.college_description?.[index] && (
                                    <div dangerouslySetInnerHTML={renderHTML(data.college_description[index])}></div>
                                )}

                                {/* Metrics */}
                                <div className="flex justify-between mt-4 space-x-4">
                                    <div
                                        className="flex-1 p-4 rounded text-center"
                                        style={{ background: surfaceColor }}
                                    >
                                        <div
                                            className="text-xl font-bold mb-1"
                                            style={{ color: accentColor }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                        <div
                                            className="text-sm uppercase"
                                            style={{ color: secondaryColor }}
                                        >
                                            Technical Focus
                                        </div>
                                    </div>

                                    <div
                                        className="flex-1 p-4 rounded text-center"
                                        style={{ background: surfaceColor }}
                                    >
                                        <div
                                            className="text-xl font-bold mb-1"
                                            style={{ color: accentColor }}
                                        >
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </div>
                                        <div
                                            className="text-sm uppercase"
                                            style={{ color: secondaryColor }}
                                        >
                                            Project Management
                                        </div>
                                    </div>

                                    <div
                                        className="flex-1 p-4 rounded text-center"
                                        style={{ background: surfaceColor }}
                                    >
                                        <div
                                            className="text-xl font-bold mb-1"
                                            style={{ color: accentColor }}
                                        >
                                            <FontAwesomeIcon icon={faShieldAlt} />
                                        </div>
                                        <div
                                            className="text-sm uppercase"
                                            style={{ color: secondaryColor }}
                                        >
                                            Safety Standards
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Additional Qualifications */}
                {data?.other_title && data?.other_title.length > 0 && data?.other_title[0] && (
                    data.other_title.map((title, index) => (
                        title && (
                            <section className="mb-10" key={`other-${index}`}>
                                <h2
                                    className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                                    style={{
                                        color: primaryColor,
                                        background: surfaceColor,
                                        borderLeftColor: accentColor
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                                    {title}
                                </h2>

                                <div
                                    className="p-5 relative border"
                                    style={{ borderColor }}
                                >
                                    {/* Gradient line at top */}
                                    <div
                                        className="absolute top-0 left-0 w-full h-1"
                                        style={{
                                            background: `linear-gradient(to right, ${accentColor}, transparent)`
                                        }}
                                    ></div>

                                    {data.other_description?.[index] && (
                                        <div dangerouslySetInnerHTML={renderHTML(data.other_description[index])}></div>
                                    )}
                                </div>
                            </section>
                        )
                    ))
                )}

                {/* Professional Languages */}
                {data?.language && data?.language.length > 0 && (
                    <section className="mb-10">
                        <h2
                            className="text-xl uppercase mb-5 py-2 px-4 border-l-4 tracking-wide"
                            style={{
                                color: primaryColor,
                                background: surfaceColor,
                                borderLeftColor: accentColor
                            }}
                        >
                            <FontAwesomeIcon icon={faLanguage} className="mr-2" />
                            Languages
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.language.map((language, index) => (
                                <div
                                    className="p-4 rounded"
                                    style={{ background: surfaceColor }}
                                    key={`lang-${index}`}
                                >
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="mr-2"
                                        style={{ color: successColor }}
                                    />
                                    <span>{language}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default IndustrialResumeTemplate;