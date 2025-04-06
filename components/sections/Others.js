import { useState } from "react";
import { Briefcase, Check, ChevronLeft, Award, ChevronRight, GraduationCap, Plus, Trophy, UserCircle2 } from 'lucide-react';
import Tab from "@/components/Layout";
import TabButton from "@/components/TabButton";
import InternshipTab from "@/components/InternshipTab";
import CertificateTab from "@/components/CertificateTab";
import OtherTab from "@/components/OtherTab";
const Others = ({ formData, updateFormData }) => {
    const [activeTab, setActiveTab] = useState('internship');
    const [activeIndex, setActiveIndex] = useState(0);

    const addItem = (type) => {
        const config = {
            internship: {
                titleKey: 'internship_title',
                descKey: 'internship_summary'
            },
            certificate: {
                titleKey: 'certificate_title',
                descKey: 'certificate_description'
            },
            other: {
                titleKey: 'other_title',
                descKey: 'other_description'
            }
        };

        const { titleKey, descKey } = config[type];
        updateFormData(titleKey, [...(formData[titleKey] || []), '']);
        updateFormData(descKey, [...(formData[descKey] || []), '']);
        setActiveIndex(formData[titleKey]?.length || 0);
    };

    // Initialize arrays if they don't exist
    if (!formData.other_title) {
        updateFormData('other_title', ['']);
        updateFormData('other_description', ['']);
    }
    const removeItem = (index, type, e) => {
        e.stopPropagation();
        let titleKey, descKey;

        switch (type) {
            case 'internship':
                titleKey = 'internship_title';
                descKey = 'internship_summary';
                break;
            case 'certificate':
                titleKey = 'certificate_title';
                descKey = 'certificate_description';
                break;
            case 'other':
                titleKey = 'other_title';
                descKey = 'other_description';
                break;
        }

        if (formData[titleKey]?.length <= 1) return;

        const newTitles = [...formData[titleKey]];
        const newDescs = [...formData[descKey]];
        newTitles.splice(index, 1);
        newDescs.splice(index, 1);

        updateFormData(titleKey, newTitles);
        updateFormData(descKey, newDescs);

        if (activeIndex >= index) {
            setActiveIndex(Math.max(0, activeIndex - 1));
        }
    };
    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
                    <p className="text-gray-500 text-sm">Add internships, certifications and other achievements</p>
                </div>
                <button
                    onClick={() => addItem(activeTab)}
                    className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100
                        transition-all duration-300 flex items-center gap-2 text-sm font-medium
                        shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    Add {activeTab === 'internship' ? 'Internship' : activeTab === 'certificate' ? 'Certificate' : 'Other'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6 border-b pb-3 overflow-x-auto hide-scrollbar">
                <TabButton
                    isActive={activeTab === 'internship'}
                    icon={Briefcase}
                    label="Internships"
                    onClick={() => {
                        setActiveTab('internship');
                        setActiveIndex(0);
                    }}
                />
                <TabButton
                    isActive={activeTab === 'certificate'}
                    icon={Award}
                    label="Certificates"
                    onClick={() => {
                        setActiveTab('certificate');
                        setActiveIndex(0);
                    }}
                />
                <TabButton
                    isActive={activeTab === 'other'}
                    icon={Plus}
                    label="Others"
                    onClick={() => {
                        setActiveTab('other');
                        setActiveIndex(0);
                    }}
                />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                <div className={activeTab === 'internship' ? 'block' : 'hidden'}>
                    <InternshipTab
                        formData={formData}
                        updateFormData={updateFormData}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        removeItem={removeItem}
                    />
                </div>
                <div className={activeTab === 'certificate' ? 'block' : 'hidden'}>
                    <CertificateTab
                        formData={formData}
                        updateFormData={updateFormData}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        removeItem={removeItem}
                    />
                </div>
                <div className={activeTab === 'other' ? 'block' : 'hidden'}>
                    <OtherTab
                        formData={formData}
                        updateFormData={updateFormData}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        removeItem={removeItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default Others;