import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const TimelineTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {

    const [profilePhoto, setProfilePhoto] = useState(null);
    const { fetchUserDetail } = useAuth();
    const getUserDetails = async () => {
        const userFound = await fetchUserDetail();
        // console.log(userFound.profile_photo_url, "user found");
        setProfilePhoto(userFound.profile_photo_url || "profile-placeholder.jpg");
        // Don't modify the data prop directly
        console.log(userFound.profile_photo_url, "profile photo");
    }
    useEffect(() => {
        getUserDetails();
    }, []);
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

    // Default accent color is purple to match the image, fallback to the fontStyles color
    const accentColor = fontStyles.font_color || "#8B5CF6";
    const bgAccentColor = "#8B5CF6"; // Fixed purple background color for header

    // Generate initials for the avatar
    const getInitials = () => {
        const firstName = mergedData.first_name || '';
        const lastName = mergedData.last_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    return (
        <div className="bg-white">
            {/* Main Template */}
            <div
                style={{
                    fontFamily: fontStyles.font_family,
                    color: fontStyles.font_color === "#000000" ? "#374151" : fontStyles.font_color,
                    fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
                    fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
                    minHeight: '250mm',
                    backgroundColor: "white",
                }}
            >
                {/* Header Section with purple background */}
                <div
                    className="p-6 mb-6 rounded-t-lg"
                    style={{ backgroundColor: bgAccentColor }}
                >
                    <div className="flex items-center">
                        {/* Avatar circle with initials */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white mr-6 text-4xl font-bold text-white"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        >
                            <img
                                src={profilePhoto || (data.profile_photo_url || "profile-placeholder.jpg")}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className={`font-bold ${isModalView ? 'text-4xl' : 'text-3xl'} mb-1 text-white`}>
                                {`${mergedData.first_name} ${mergedData.last_name}`}
                            </h1>
                            <div className={`${isModalView ? 'text-xl' : 'text-lg'} mb-2 text-white`}>
                                {mergedData.professional_summary}
                            </div>

                            {/* Contact information with icons - horizontal layout */}
                            <div className="flex flex-wrap mt-3 gap-4">
                                <div className="flex items-center text-white">
                                    <span className="mr-2">✉️</span>
                                    <span>{mergedData.email}</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <span className="mr-2">📱</span>
                                    <span>{mergedData.phone}</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <span className="mr-2">📍</span>
                                    <span>{`${mergedData.city}, ${mergedData.country}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content container with padding */}
                <div className="px-6">
                    {/* Professional description with stylized quote */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <div
                            dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
                            className="prose max-w-none text-gray-600"
                        />
                    </div>

                    {/* Professional Experience Section with Timeline */}
                    <div className="mb-10">
                        <div className="flex items-center mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                style={{ backgroundColor: accentColor }}
                            >
                                <span className="text-xl">💼</span>
                            </div>
                            <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                Professional Experience
                            </h2>
                        </div>

                        <div className="relative ml-6">
                            {/* Timeline track */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 h-full ml-5"
                                style={{ backgroundColor: `${accentColor}40` }}
                            ></div>

                            {mergedData.job_title && mergedData.job_title.map((title, index) => (
                                <div key={index} className="relative mb-8 pb-2 pl-10">
                                    {/* Timeline circle */}
                                    <div
                                        className="absolute left-0 w-3 h-3 rounded-full mt-2 ml-5.5"
                                        style={{ backgroundColor: accentColor }}
                                    ></div>

                                    {/* Job details */}
                                    <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-1`}>
                                        {title}
                                    </div>
                                    <div
                                        className="text-base font-medium mb-1"
                                        style={{ color: accentColor }}
                                    >
                                        {mergedData.employer[index]}
                                    </div>
                                    <div className={`text-gray-500 ${isModalView ? 'text-sm' : 'text-xs'} mb-3`}>
                                        {`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                                        className="prose max-w-none text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Internships Section */}
                    {mergedData.internship_title && mergedData.internship_title.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <span className="text-xl">✅</span>
                                </div>
                                <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                    Internships
                                </h2>
                            </div>

                            <div className="relative ml-6">
                                {/* Timeline track */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 h-full ml-5"
                                    style={{ backgroundColor: `${accentColor}40` }}
                                ></div>

                                {mergedData.internship_title.map((title, index) => (
                                    <div key={index} className="relative mb-8 pb-2 pl-10">
                                        {/* Timeline circle */}
                                        <div
                                            className="absolute left-0 w-3 h-3 rounded-full mt-2 ml-5.5"
                                            style={{ backgroundColor: accentColor }}
                                        ></div>

                                        <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-1`}>
                                            {title}
                                        </div>
                                        <div className={`text-gray-500 ${isModalView ? 'text-sm' : 'text-xs'} mb-3`}>
                                            {mergedData.internship_date && mergedData.internship_date[index] || ''}
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                                            className="prose max-w-none text-gray-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                style={{ backgroundColor: accentColor }}
                            >
                                <span className="text-xl">🎓</span>
                            </div>
                            <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                Education
                            </h2>
                        </div>

                        <div className="relative ml-6">
                            {/* Timeline track */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 h-full ml-5"
                                style={{ backgroundColor: `${accentColor}40` }}
                            ></div>

                            {mergedData.college && mergedData.college.map((college, index) => (
                                <div key={index} className="relative mb-8 pb-2 pl-10">
                                    {/* Timeline circle */}
                                    <div
                                        className="absolute left-0 w-3 h-3 rounded-full mt-2 ml-5.5"
                                        style={{ backgroundColor: accentColor }}
                                    ></div>

                                    <div className={`font-semibold ${isModalView ? 'text-lg' : 'text-base'} mb-1`}>
                                        {mergedData.degree[index]}
                                    </div>
                                    <div className="text-base mb-1" style={{ color: accentColor }}>
                                        {college}
                                    </div>
                                    <div className={`text-gray-500 ${isModalView ? 'text-sm' : 'text-xs'} mb-3`}>
                                        {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                                        className="prose max-w-none text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills & Languages Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                style={{ backgroundColor: accentColor }}
                            >
                                <span className="text-xl">🔧</span>
                            </div>
                            <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                Skills & Languages
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-16">
                            {/* Skills section */}
                            <div>
                                <h3 className={`font-medium ${isModalView ? 'text-lg' : 'text-base'} mb-2 text-gray-700`}>
                                    Design Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {mergedData.skill && mergedData.skill.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full text-sm"
                                            style={{
                                                backgroundColor: `${accentColor}20`,
                                                color: accentColor,
                                                border: `1px solid ${accentColor}40`
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Languages section */}
                            <div>
                                <h3 className={`font-medium ${isModalView ? 'text-lg' : 'text-base'} mb-2 text-gray-700`}>
                                    Languages
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {mergedData.language && mergedData.language.map((lang, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full text-sm"
                                            style={{
                                                backgroundColor: "rgba(243, 244, 246, 1)",
                                                color: "#4B5563",
                                                border: "1px solid rgba(229, 231, 235, 1)"
                                            }}
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tools section if needed */}
                            {mergedData.tools && mergedData.tools.length > 0 && (
                                <div>
                                    <h3 className={`font-medium ${isModalView ? 'text-lg' : 'text-base'} mb-2 text-gray-700`}>
                                        Tools
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {mergedData.tools.map((tool, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded-full text-sm"
                                                style={{
                                                    backgroundColor: "rgba(238, 242, 255, 1)",
                                                    color: "#6366F1",
                                                    border: "1px solid rgba(224, 231, 255, 1)"
                                                }}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certificates Section */}
                    {mergedData.certificate_title && mergedData.certificate_title.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <span className="text-xl">🏆</span>
                                </div>
                                <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                    Certificates
                                </h2>
                            </div>

                            <div className="space-y-4 pl-16">
                                {mergedData.certificate_title.map((title, index) => (
                                    <div key={index} className="p-3 rounded-lg border border-gray-200">
                                        <div className={`font-semibold ${isModalView ? 'text-base' : 'text-sm'}`}>
                                            {title}
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                                            className="prose max-w-none text-gray-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other sections */}
                    {mergedData.other_title && mergedData.other_title.map((title, index) => (
                        <div key={index} className="mb-10">
                            <div className="flex items-center mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <span className="text-xl">✨</span>
                                </div>
                                <h2 className={`font-semibold ${isModalView ? 'text-2xl' : 'text-xl'}`}>
                                    {title}
                                </h2>
                            </div>

                            <div className="prose max-w-none text-gray-600 pl-16"
                                dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineTemplate;