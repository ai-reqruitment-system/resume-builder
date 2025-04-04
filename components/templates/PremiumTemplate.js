import { useState } from "react";
import Image from 'next/image';

const defaultData = {
    first_name: "John",
    last_name: "Doe",
    occupation: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    city: "New York",
    country: "USA",
    professional_description: "<p>Experienced software engineer with a passion for building scalable applications.</p>",
    job_title: ["Senior Software Engineer"],
    employer: ["Tech Corp"],
    job_begin: ["2018"],
    job_end: ["Present"],
    job_description: ["<p>Led development of enterprise applications.</p>"],
    college: ["University of Tech"],
    degree: ["Bachelor of Science in Computer Science"],
    college_begin: ["2011"],
    college_end: ["2015"],
    college_description: ["<p>Graduated with honors in Computer Science.</p>"],
    internship_title: ["Software Development Intern"],
    internship_summary: ["<p>Developed features for mobile applications.</p>"],
    certificate_title: ["AWS Certified Developer"],
    certificate_description: ["<p>Professional cloud development certification.</p>"],
    other_title: ["Volunteer Work"],
    other_description: ["<p>Tech mentor for coding bootcamps.</p>"],
    skill: ["JavaScript", "React", "Node.js"],
    language: ["English", "Spanish"]
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

const PremiumTemplate = ({ data = {}, fontStyles, isModalView }) => {
    const mergedData = mergeDataWithDefaults(data, defaultData);

    return (
        <div className="container" style={{
            fontFamily: fontStyles.font_family,
            color: fontStyles.font_color,
            fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
            fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
            // width: '210mm',
            // minHeight: '250mm',
            // margin: '0 auto',
            // display: 'grid',
            // gridTemplateColumns: '70mm 140mm',
        }}>
            <aside className="sidebar bg-gradient-to-br from-blue-900 to-blue-800 text-white p-10 relative">
                {/* Rest of the component remains the same, just replace data. with mergedData. */}
                <div className="profile text-center relative z-10 mb-10">
                    <h1 className={`${isModalView ? 'text-3xl' : 'text-2xl'} mb-2 tracking-wide`}>
                        {`${mergedData.first_name} ${mergedData.last_name}`}
                    </h1>
                    <h2 className="text-blue-300 text-lg font-normal mb-6">{mergedData.occupation}</h2>
                </div>

                <div className="contact-info mb-10">
                    <div className="flex items-center mb-4">
                        <span className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-4">📍</span>
                        <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-4">📧</span>
                        <span>{mergedData.email}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-4">📱</span>
                        <span>{mergedData.phone}</span>
                    </div>
                </div>

                <div className="skills-section mb-10">
                    <h3 className="text-blue-300 text-xl mb-4">SKILLS</h3>
                    {mergedData.skill.map((skill, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>{skill}</span>
                                <span>95%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                                <div className="h-full bg-blue-300 rounded" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="languages-section">
                    <h3 className="text-blue-300 text-xl mb-4">LANGUAGES</h3>
                    <div className="flex flex-wrap gap-2">
                        {mergedData.language.map((lang, index) => (
                            <span key={index} className="bg-white/10 px-4 py-2 rounded-full text-sm">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="main-content bg-white p-12">
                <section className="mb-10">
                    <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                        PROFESSIONAL SUMMARY
                    </h2>
                    <div
                        dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                        className="text-gray-600 prose max-w-none"
                    />
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                        WORK EXPERIENCE
                    </h2>
                    {mergedData.job_title.map((title, index) => (
                        <div key={index} className="mb-6 pl-8 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-3 before:h-3 before:rounded-full before:bg-blue-300 before:border-2 before:border-white before:shadow-[0_0_0_3px_#64b5f6]">
                            <div className="text-xl font-semibold text-gray-800 mb-1">{title}</div>
                            <div className="flex justify-between text-blue-600 mb-2">
                                <span>{mergedData.employer[index]}</span>
                                <span className="text-gray-500">{`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}</span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                className="prose max-w-none text-gray-600"
                            />
                        </div>
                    ))}
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                        EDUCATION
                    </h2>
                    {mergedData.college.map((college, index) => (
                        <div key={index} className="mb-6 pl-8 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-3 before:h-3 before:rounded-full before:bg-blue-300 before:border-2 before:border-white before:shadow-[0_0_0_3px_#64b5f6]">
                            <div className="text-xl font-semibold text-gray-800">{mergedData.degree[index]}</div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-600">{college}</span>
                                <span className="text-gray-500">{`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}</span>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                className="prose max-w-none text-gray-600 mt-2"
                            />
                        </div>
                    ))}
                </section>

                {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                            CERTIFICATES
                        </h2>
                        {mergedData.certificate_title.map((title, index) => (
                            <div key={index} className="mb-4">
                                <div className="text-xl font-semibold text-gray-800">{title}</div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                    className="prose max-w-none text-gray-600"
                                />
                            </div>
                        ))}
                    </section>
                )}

                {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                            INTERNSHIPS
                        </h2>
                        {mergedData.internship_title.map((title, index) => (
                            <div key={index} className="mb-4">
                                <div className="text-xl font-semibold text-gray-800">{title}</div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                    className="prose max-w-none text-gray-600"
                                />
                            </div>
                        ))}
                    </section>
                )}

                {mergedData.other_title && mergedData.other_title.length > 0 && mergedData.other_title.map((title, index) => (
                    <section key={index} className="mb-10">
                        <h2 className="text-2xl text-blue-900 mb-6 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-blue-300">
                            {title}
                        </h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                            className="prose max-w-none text-gray-600"
                        />
                    </section>
                ))}
            </main>
        </div>
    );
};

export default PremiumTemplate;