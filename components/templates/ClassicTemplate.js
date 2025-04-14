import React from 'react';

const ClassicTemplate = ({ data }) => {
    return (
        <div className="w-full h-[900px] relative flex">
            {/* Left Sidebar */}
            <div className="w-[35%] h-full bg-[#2D3E50] p-5 flex flex-col">
                {/* About Me Section */}
                <div className="mb-12">
                    <h2 className="text-[#3498DB] text-2xl mb-5">ABOUT ME</h2>
                    <p className="text-white text-sm leading-relaxed">
                        <div
                            dangerouslySetInnerHTML={{ __html: data.professional_description }}
                            className="prose max-w-none"
                        />
                    </p>
                </div>

                {/* Skills Section */}
                <div className="mb-12">
                    <h2 className="text-[#3498DB] text-2xl mb-5">SKILLS</h2>
                    {data.skill?.map((skill, index) => (
                        <div key={index} className="bg-white/10 rounded mb-2.5">
                            <div className="p-3">
                                <span className="text-white text-sm">{skill}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Languages Section */}
                <div>
                    <h2 className="text-[#3498DB] text-2xl mb-5">LANGUAGES</h2>
                    {data.language?.map((language, index) => (
                        <div key={index} className="bg-white/10 rounded mb-2.5">
                            <div className="p-3">
                                <span className="text-white text-sm">{language}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Content */}
            <div className="w-[63%] ml-[2%] p-5">
                {/* Header Section */}
                <h1 className="text-4xl text-[#2D3E50] mb-1">
                    {data.first_name}{' '}
                    <span className="text-[#3498DB]">{data.last_name}</span>
                </h1>
                <p className="text-lg text-gray-600 mb-4 uppercase">
                    {data.professional_summary}
                </p>
                <p className="text-gray-600 text-sm mb-8 pb-4 border-b-2 border-[#3498DB]">
                    {data.email} • {data.phone} • {data.city}, {data.country}
                </p>

                {/* Experience Section */}
                <div className="mb-8">
                    <h2 className="text-2xl text-[#2D3E50] mb-5 pb-2 border-b-2 border-[#3498DB]">
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    {data.job_title?.map((title, index) => (
                        <div
                            key={index}
                            className="pl-4 border-l-4 border-[#3498DB] mb-5"
                        >
                            <h3 className="text-lg text-[#2D3E50] mb-1">{title}</h3>
                            <p className="text-[#3498DB] mb-1">{data.employer[index]}</p>
                            <p className="text-gray-600 text-sm mb-1">
                                {data.job_begin[index]} - {data.job_end[index]}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {data.job_description[index]}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Education Section */}
                <div>
                    <h2 className="text-2xl text-[#2D3E50] mb-5 pb-2 border-b-2 border-[#3498DB]">
                        EDUCATION
                    </h2>
                    {data.college?.map((college, index) => (
                        <div
                            key={index}
                            className="pl-4 border-l-4 border-[#3498DB] mb-5"
                        >
                            <h3 className="text-lg text-[#2D3E50] mb-1">
                                {data.degree[index]}
                            </h3>
                            <p className="text-[#3498DB] mb-1">{college}</p>
                            <p className="text-gray-600 text-sm">
                                {data.college_begin[index]} - {data.college_end[index]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassicTemplate;