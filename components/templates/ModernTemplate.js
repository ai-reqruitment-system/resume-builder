const ModernTemplate = ({ data = {}, fontStyles, isModalView, defaultData }) => {
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
  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full overflow-y-auto">
      <div className="min-h-full w-full">
        {/* Main Template */}
        <div
          style={{
            fontFamily: fontStyles.font_family,
            color: fontStyles.font_color,
            fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
            fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
            minHeight: '250mm',
          }}
          className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10"
        >
          {/* Heading Section */}
          <div className={`border-b-2 border-teal-400 pb-4 mb-4 ${isModalView ? 'text-lg' : 'text-sm'}`}>
            <div>
              <h1 className={`font-bold mb-2 ${isModalView ? 'text-2xl' : 'text-lg'}`}>{`${mergedData.first_name} ${mergedData.last_name}`}</h1>
              <div className={`text-teal-600 font-medium ${isModalView ? 'text-xl' : 'text-lg'}`}>
                {mergedData.professional_summary}
              </div>
            </div>
            <div className={`text-right text-gray-600 ${isModalView ? 'text-lg' : 'text-sm'}`}>
              <p>{mergedData.email}</p>
              <p>{mergedData.phone}</p>
              <p>{`${mergedData.city}, ${mergedData.country}`}</p>
            </div>
          </div>
          {/* Other sections */}
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Professional Summary
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
              className="prose max-w-none"
            />
          </div>
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Experience
            </h2>
            {mergedData.job_title.map((title, index) => (
              <div key={index} className="mb-4">
                <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-1`}>{title}</div>
                <div className="flex justify-between text-teal-600 mb-2">
                  <span>{mergedData.employer[index]}</span>
                  <span
                    className={`text-gray-500 ${isModalView ? 'text-base' : 'text-sm'}`}>{`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}</span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                  className="prose max-w-none"
                />
              </div>
            ))}
          </div>
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Education
            </h2>
            {mergedData.college.map((college, index) => (
              <div key={index} className="mb-4">
                <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{mergedData.degree[index]}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-600">{college}</span>
                    <span className={`text-gray-500 ${isModalView ? 'text-base' : 'text-sm'}`}>
                      {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                    className="prose max-w-none text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Internships
            </h2>
            {mergedData.internship_title && mergedData.internship_title.map((title, index) => (
              <div key={index} className="mb-4">
                <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{title}</div>
                <div className="space-y-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                    className="prose max-w-none text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Certificates
            </h2>
            {mergedData.certificate_title && mergedData.certificate_title.map((title, index) => (
              <div key={index} className="mb-4">
                <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{title}</div>
                <div className="space-y-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                    className="prose max-w-none text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
          {mergedData.other_title && mergedData.other_title.map((title, index) => (
            <div key={index} className="mb-8">
              <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
                {title}
              </h2>
              <div className="mb-4">
                <div className="space-y-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                    className="prose max-w-none text-gray-600"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              Skills & Languages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {mergedData.skill.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {mergedData.language.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm border"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
=======
    <div>
      {/* Main Template */}
      <div
        style={{
          fontFamily: fontStyles.font_family,
          color: fontStyles.font_color,
          fontWeight: fontStyles.is_font_bold ? "bold" : "normal",
          fontStyle: fontStyles.is_font_italic ? "italic" : "normal",
          padding: "10px",
          minHeight: '250mm',
        }}
      >
        {/* Heading Section */}
        <div className={`border-b-2 border-teal-400 pb-4 mb-4 ${isModalView ? 'text-lg' : 'text-sm'}`}>
          <div>
            <h1 className={`font-bold mb-2 ${isModalView ? 'text-2xl' : 'text-lg'}`}>{`${mergedData.first_name} ${mergedData.last_name}`}</h1>
            <div className={`text-teal-600 font-medium ${isModalView ? 'text-xl' : 'text-lg'}`}>
              {mergedData.occupation}
            </div>
          </div>
          <div className={`text-right text-gray-600 ${isModalView ? 'text-lg' : 'text-sm'}`}>
            <p>{mergedData.email}</p>
            <p>{mergedData.phone}</p>
            <p>{`${mergedData.city}, ${mergedData.country}`}</p>
          </div>
        </div>
        {/* Other sections */}
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Professional Summary
          </h2>
          <div
            dangerouslySetInnerHTML={{ __html: mergedData.professional_description }}
            className="prose max-w-none"
          />
        </div>
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Experience
          </h2>
          {mergedData.job_title.map((title, index) => (
            <div key={index} className="mb-4">
              <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'} mb-1`}>{title}</div>
              <div className="flex justify-between text-teal-600 mb-2">
                <span>{mergedData.employer[index]}</span>
                <span
                  className={`text-gray-500 ${isModalView ? 'text-base' : 'text-sm'}`}>{`${mergedData.job_begin[index]} - ${mergedData.job_end[index]}`}</span>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: mergedData.job_description[index] }}
                className="prose max-w-none"
              />
            </div>
          ))}
        </div>
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Education
          </h2>
          {mergedData.college.map((college, index) => (
            <div key={index} className="mb-4">
              <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{mergedData.degree[index]}</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-teal-600">{college}</span>
                  <span className={`text-gray-500 ${isModalView ? 'text-base' : 'text-sm'}`}>
                    {`${mergedData.college_begin[index]} - ${mergedData.college_end[index]}`}
                  </span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: mergedData.college_description[index] }}
                  className="prose max-w-none text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Internships
          </h2>
          {mergedData.internship_title && mergedData.internship_title.map((title, index) => (
            <div key={index} className="mb-4">
              <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{title}</div>
              <div className="space-y-2">
                <div
                  dangerouslySetInnerHTML={{ __html: mergedData.internship_summary[index] }}
                  className="prose max-w-none text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Certificates
          </h2>
          {mergedData.certificate_title && mergedData.certificate_title.map((title, index) => (
            <div key={index} className="mb-4">
              <div className={`font-semibold ${isModalView ? 'text-xl' : 'text-lg'}`}>{title}</div>
              <div className="space-y-2">
                <div
                  dangerouslySetInnerHTML={{ __html: mergedData.certificate_description[index] }}
                  className="prose max-w-none text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
        {mergedData.other_title && mergedData.other_title.map((title, index) => (
          <div key={index} className="mb-8">
            <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
              {title}
            </h2>
            <div className="mb-4">
              <div className="space-y-2">
                <div
                  dangerouslySetInnerHTML={{ __html: mergedData.other_description[index] }}
                  className="prose max-w-none text-gray-600"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="mb-8">
          <h2 className={`font-semibold border-b pb-2 mb-4 ${isModalView ? 'text-xl' : 'text-lg'}`}>
            Skills & Languages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {mergedData.skill.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-sm border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {mergedData.language.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-sm border"
                  >
                    {lang}
                  </span>
                ))}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;