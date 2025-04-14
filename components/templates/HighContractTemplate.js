import React from 'react';

const HighContractTemplate = ({
    data = {},
    fontStyles = {},
    defaultData = {}
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

    const chunkArray = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

    return (
        <div className="w-full bg-white"
            style={{
                fontFamily: fontStyles.font_family || "'Arial Black', 'Arial Bold', Arial, sans-serif",
                lineHeight: 1.4,
                fontWeight: fontStyles.is_font_bold ? 'bold' : 'normal',
                fontStyle: fontStyles.is_font_italic ? 'italic' : 'normal',
                color: fontStyles.font_color,
            }}>

            {/* Header Section */}
            <header className="bg-black text-white p-8 -m-2 mb-8 border-5 border-black relative">
                <h1 className="text-5xl uppercase mb-3 tracking-tight text-white">
                    {`${mergedData.first_name || 'John'} ${mergedData.last_name || 'Doe'}`}
                </h1>
                <p className="text-2xl uppercase font-bold" style={{ color: fontStyles.font_color || 'white' }}>
                    {mergedData.professional_summary || 'Professional'}
                </p>

                {/* Contact Info */}
                <div className="mt-5 w-full table">
                    <div className="table-row">
                        {[
                            mergedData.email || 'email@example.com',
                            mergedData.phone || '(555) 123-4567',
                            `${mergedData.city || 'City'}, ${mergedData.country || 'Country'}`
                        ].map((item, index) => (
                            <span key={index} className="table-cell p-2 bg-white text-black font-bold border-3 border-black m-2">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            {/* Professional Summary */}
            {mergedData.professional_description && (
                <section className="mb-8 p-5 border-5 border-black bg-white relative">
                    <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                        About
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: mergedData.professional_description }} />
                </section>
            )}

            {/* Skills Section */}
            {mergedData.skill?.length > 0 && (
                <section className="mb-8 p-5 border-5 border-black bg-white relative">
                    <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                        Skills
                    </h2>
                    <div className="w-full table border-separate" style={{ borderSpacing: '10px' }}>
                        {chunkArray(mergedData.skill, 4).map((skillRow, rowIndex) => (
                            <div key={rowIndex} className="table-row">
                                {skillRow.map((skill, index) => (
                                    <div key={index}
                                        className="table-cell p-4 bg-black text-white text-center border-3 border-black uppercase font-bold w-1/4"
                                        style={{ transform: index % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)' }}>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {mergedData.job_title?.length > 0 && (
                <section className="mb-8 p-5 border-5 border-black bg-white relative">
                    <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                        Experience
                    </h2>
                    {mergedData.job_title.map((title, index) => (
                        title && (
                            <div key={index} className="mb-5 p-5 border-3 border-black bg-white relative experience-card">
                                <h3 className="text-xl uppercase mb-1" style={{ color: fontStyles.font_color || '#333333' }}>
                                    {title}
                                </h3>
                                <p className="text-lg font-bold" style={{ color: fontStyles.font_color || '#333333' }}>
                                    {mergedData.employer?.[index] || ''}
                                </p>
                                <p className="font-bold my-1" style={{ color: fontStyles.font_color || '#666666' }}>
                                    {`${mergedData.job_begin?.[index] || ''} - ${mergedData.job_end?.[index] || ''}`}
                                </p>
                                <div dangerouslySetInnerHTML={{ __html: mergedData.job_description?.[index] || '' }} />
                            </div>
                        )
                    ))}
                </section>
            )}

            {/* Education Section */}
            {mergedData.college?.length > 0 && (
                <section className="mb-8 p-5 border-5 border-black bg-white relative">
                    <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                        Education
                    </h2>
                    {mergedData.college.map((college, index) => (
                        <div key={index} className="mb-5 p-4 border-3 border-black bg-white relative ml-5 education-card">
                            <h3 className="text-xl uppercase mb-1" style={{ color: fontStyles.font_color || '#333333' }}>
                                {mergedData.degree?.[index] || ''}
                            </h3>
                            <p className="text-lg font-bold" style={{ color: fontStyles.font_color || '#333333' }}>
                                {college}
                            </p>
                            <p className="font-bold my-1" style={{ color: fontStyles.font_color || '#666666' }}>
                                {`${mergedData.college_begin?.[index] || ''} - ${mergedData.college_end?.[index] || ''}`}
                            </p>
                            {mergedData.college_description?.[index] && (
                                <div dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }} />
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Certificates Section */}
            {mergedData.certificate_title?.length > 0 && (
                <section className="mb-8 p-5 border-5 border-black bg-white relative">
                    <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                        Certificates
                    </h2>
                    <div className="grid grid-cols-2 gap-5">
                        {mergedData.certificate_title.map((title, index) => (
                            <div key={index} className="p-4 border-3 border-black bg-white relative certificate-card">
                                <h3 className="text-xl uppercase mb-1" style={{ color: fontStyles.font_color || '#333333' }}>
                                    {title}
                                </h3>
                                {mergedData.certificate_description?.[index] && (
                                    <div dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }} />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Other Sections */}
            {mergedData.other_title?.length > 0 &&
                mergedData.other_title.map((title, index) => (
                    title && (
                        <section key={index} className="mb-8 p-5 border-5 border-black bg-white relative">
                            <h2 className="bg-black text-white px-5 py-3 inline-block uppercase text-2xl -ml-8 border-5 border-black relative -top-8">
                                {title}
                            </h2>
                            <div className="p-5 border-3 border-black bg-white relative">
                                <div dangerouslySetInnerHTML={{ __html: mergedData.other_description?.[index] || '' }} />
                            </div>
                        </section>
                    )
                ))}

            <style jsx>{`
        .border-5 {
          border-width: 5px;
        }
        .border-3 {
          border-width: 3px;
        }
        .experience-card::before,
        .education-card::before,
        .certificate-card::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: -5px;
          bottom: -5px;
          background: black;
          z-index: -1;
        }
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 20mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          section {
            break-inside: avoid;
          }
          .bg-black {
            background-color: black !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
        </div>
    );
};

export default HighContractTemplate;