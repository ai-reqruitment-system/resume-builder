import { createSlice } from '@reduxjs/toolkit';
import { uuid } from 'uuidv4';

const initialState = {
    formData: {
        template_id: 1,
        unique_id: uuid(),
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        occupation: '',
        city: '',
        country: '',
        pincode: '',
        dob: '',
        professional_description: '',
        professional_summary: '',
        profile_photo_url: '',
        job_title: [],
        employer: [],
        job_begin: [],
        job_end: [],
        job_description: [],
        college: [],
        degree: [],
        college_begin: [],
        college_end: [],
        college_description: [],
        language: [],
        skill: [],
        templateName: 'modern',
        internship_title: [],
        internship_summary: [],
        internship_start_date: [],
        internship_end_date: [],
        certificate_title: [],
        certificate_description: [],
        other_title: [],
        other_description: [],
    },
    profileData: {},
    userData: {},
    resumeList: [],
    isResumeListUpdated: false,
    defaultData: {
        first_name: "John",
        last_name: "Doe",
        occupation: "Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        city: "New York",
        country: "USA",
        profile_photo_url: "",
        professional_description: "<p>Experienced software engineer with a passion for building scalable and efficient web applications. Proficient in JavaScript, React, and Node.js.</p>",
        job_title: ["Senior Software Engineer", "Software Engineer"],
        employer: ["Tech Corp", "Innovate Inc"],
        job_begin: ["2018", "2015"],
        job_end: ["Present", "2018"],
        job_description: [
            "<p>Led a team of developers to build a scalable e-commerce platform.</p>",
            "<p>Developed and maintained web applications using React and Node.js.</p>"
        ],
        college: ["University of Tech", "State College"],
        degree: ["Bachelor of Science in Computer Science", "Associate Degree in IT"],
        college_begin: ["2011", "2009"],
        college_end: ["2015", "2011"],
        college_description: [
            "<p>Graduated with honors, focusing on software development and algorithms.</p>",
            "<p>Completed foundational courses in programming and systems design.</p>"
        ],
        internship_title: ["Software Development Intern"],
        internship_summary: [
            "<p>Assisted in the development of a mobile application using Flutter.</p>"
        ],
        certificate_title: ["Certified JavaScript Developer"],
        certificate_description: [
            "<p>Completed advanced JavaScript courses and passed the certification exam.</p>"
        ],
        other_title: ["Volunteer Work"],
        other_description: [
            "<p>Volunteered as a mentor for coding bootcamps, helping students learn programming basics.</p>"
        ],
        skill: ["JavaScript", "React", "Node.js", "Python", "SQL"],
        language: ["English", "Spanish"]
    }
};

export const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        updateFormField: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        setProfileData: (state, action) => {
            state.profileData = action.payload;

            // Map profile data to form data structure
            if (Object.keys(action.payload).length > 0) {
                const mappedData = {
                    ...state.formData,
                    first_name: action.payload.first_name || '',
                    last_name: action.payload.last_name || '',
                    email: action.payload.email || '',
                    phone: action.payload.phone || '',
                    occupation: action.payload.occupation || '',
                    city: action.payload.city || '',
                    country: action.payload.country || '',
                    pincode: action.payload.pincode || '',
                    dob: action.payload.dob || '',
                    professional_description: action.payload.professional_description || '',
                    profile_photo_url: action.payload.profile_photo_url || '',
                };

                if (action.payload.job && action.payload.job.length > 0) {
                    mappedData.job_title = action.payload.job.map(job => job.job_title);
                    mappedData.employer = action.payload.job.map(job => job.employer);
                    mappedData.job_begin = action.payload.job.map(job => job.begin);
                    mappedData.job_end = action.payload.job.map(job => job.end);
                    mappedData.job_description = action.payload.job.map(job => job.description);
                }

                if (action.payload.education && action.payload.education.length > 0) {
                    mappedData.college = action.payload.education.map(edu => edu.college);
                    mappedData.degree = action.payload.education.map(edu => edu.degree);
                    mappedData.college_begin = action.payload.education.map(edu => edu.begin);
                    mappedData.college_end = action.payload.education.map(edu => edu.end);
                    mappedData.college_description = action.payload.education.map(edu => edu.description || null);
                }

                if (action.payload.languages && action.payload.languages.length > 0) {
                    mappedData.language = [...new Set(action.payload.languages.map(lang => lang.language))];
                }

                if (action.payload.skills && action.payload.skills.length > 0) {
                    mappedData.skill = action.payload.skills.map(skill => skill.skill);
                }

                state.formData = mappedData;
            }
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        // New actions for resume list management
        setResumeList: (state, action) => {
            state.resumeList = action.payload;
            state.isResumeListUpdated = false;
        },
        updateResumeList: (state, action) => {
            // Add or update a resume in the list
            const updatedResume = action.payload;
            const existingIndex = state.resumeList.findIndex(resume => resume.id === updatedResume.id);

            if (existingIndex >= 0) {
                // Update existing resume
                state.resumeList[existingIndex] = updatedResume;
            } else {
                // Add new resume
                state.resumeList.push(updatedResume);
            }

            state.isResumeListUpdated = true;
        },
        markResumeListAsUpdated: (state) => {
            state.isResumeListUpdated = true;
        },
        resetResumeListUpdateFlag: (state) => {
            state.isResumeListUpdated = false;
        },
    },
});

export const {
    setFormData,
    updateFormField,
    setProfileData,
    setUserData,
    setResumeList,
    updateResumeList,
    markResumeListAsUpdated,
    resetResumeListUpdateFlag
} = resumeSlice.actions;

export default resumeSlice.reducer;