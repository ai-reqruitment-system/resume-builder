// MinimalTemplate.js
import React from 'react';

const MinimalTemplate = ({ data }) => (
    <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        color: '#2c3e50',
        lineHeight: 1.6
    }}>
        <div style={{
            textAlign: 'center',
            marginBottom: '40px'
        }}>
            <h1 style={{
                fontSize: '36px',
                margin: 0,
                fontWeight: 300,
                color: '#2c3e50'
            }}>{`${data.first_name} ${data.last_name}`}</h1>

            <p style={{
                fontSize: '18px',
                color: '#7f8c8d',
                margin: '8px 0'
            }}>{data.professional_summary}</p>

            <div style={{
                color: '#7f8c8d',
                fontSize: '14px'
            }}>
                <span style={{ margin: '0 8px' }}>{data.email}</span> •
                <span style={{ margin: '0 8px' }}>{data.phone}</span> •
                <span style={{ margin: '0 8px' }}>{`${data.city}, ${data.country}`}</span>
            </div>
        </div>

        {data.professional_description && (
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 500,
                    marginBottom: '20px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #e0e0e0'
                }}>Professional Summary</h2>
                <p>{data.professional_description}</p>
            </div>
        )}

        {data.job_title && (
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 500,
                    marginBottom: '20px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #e0e0e0'
                }}>Experience</h2>
                {data.job_title.map((title, index) => (
                    <div key={index} style={{ marginBottom: '25px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            marginBottom: '5px'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 500,
                                margin: 0,
                                color: '#34495e'
                            }}>{title}</h3>
                            <span style={{
                                fontSize: '14px',
                                color: '#95a5a6'
                            }}>{data.job_begin[index]} - {data.job_end[index]}</span>
                        </div>
                        <p style={{
                            fontSize: '16px',
                            color: '#3498db',
                            margin: '5px 0'
                        }}>{data.employer[index]}</p>
                        <p style={{
                            color: '#666',
                            marginBottom: '20px',
                            fontSize: '15px'
                        }}>{data.job_description[index]}</p>
                    </div>
                ))}
            </div>
        )}

        {data.college && (
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 500,
                    marginBottom: '20px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #e0e0e0'
                }}>Education</h2>
                {data.college.map((college, index) => (
                    <div key={index} style={{ marginBottom: '25px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            marginBottom: '5px'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 500,
                                margin: 0,
                                color: '#34495e'
                            }}>{data.degree[index]}</h3>
                            <span style={{
                                fontSize: '14px',
                                color: '#95a5a6'
                            }}>{data.college_begin[index]} - {data.college_end[index]}</span>
                        </div>
                        <p style={{
                            fontSize: '16px',
                            color: '#3498db',
                            margin: '5px 0'
                        }}>{college}</p>
                    </div>
                ))}
            </div>
        )}

        <div style={{ marginBottom: '30px' }}>
            <h2 style={{
                fontSize: '22px',
                fontWeight: 500,
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '2px solid #e0e0e0'
            }}>Skills & Languages</h2>
            <div style={{
                display: 'flex',
                gap: '40px'
            }}>
                {data.skill && (
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            marginBottom: '12px'
                        }}>Skills</h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            {data.skill.map((skill, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#f7f9fc',
                                    color: '#2c3e50',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    border: '1px solid #e0e0e0'
                                }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {data.language && (
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            marginBottom: '12px'
                        }}>Languages</h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            {data.language.map((language, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#f7f9fc',
                                    color: '#2c3e50',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    border: '1px solid #e0e0e0'
                                }}>{language}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default MinimalTemplate;