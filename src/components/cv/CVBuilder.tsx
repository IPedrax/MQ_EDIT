import { useState, useEffect } from 'react';
import type { CVData } from '../../types/cv';
import { PersonalInfoModule } from './modules/PersonalInfoModule';
import { ExperienceModule } from './modules/ExperienceModule';
import { EducationModule } from './modules/EducationModule';
import { SkillsModule } from './modules/SkillsModule';
import { CVPreview } from './CVPreview';
import { AIAssistant } from './AIAssistant';

export function CVBuilder({ initialData }: { initialData?: Partial<CVData> }) {
    const [cvData, setCvData] = useState<CVData>({
        personalInfo: {
            fullName: initialData?.personalInfo?.fullName || '',
            email: initialData?.personalInfo?.email || '',
            phone: initialData?.personalInfo?.phone || '',
            linkedin: initialData?.personalInfo?.linkedin || '',
            website: initialData?.personalInfo?.website || '',
            location: initialData?.personalInfo?.location || '',
            summary: initialData?.personalInfo?.summary || '',
        },
        experience: initialData?.experience || [],
        education: initialData?.education || [],
        skills: initialData?.skills || [],
        languages: initialData?.languages || [],
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

    // Update state when initialData changes (e.g. after file upload analysis)
    useEffect(() => {
        if (initialData) {
            setCvData(prev => ({
                ...prev,
                ...initialData,
                personalInfo: { ...prev.personalInfo, ...initialData.personalInfo }
            }));
        }
    }, [initialData]);

    const updateCV = (newData: Partial<CVData>) => {
        setCvData(prev => ({ ...prev, ...newData }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-12 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Editor de Currículo</h2>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('editor')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'editor'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Editor
                            </button>
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'preview'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Visualizar
                            </button>
                        </div>
                    </div>

                    <div className={viewMode === 'editor' ? 'block' : 'hidden'}>
                        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
                            {['personal', 'experience', 'education', 'skills'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {activeTab === 'personal' && (
                                <PersonalInfoModule
                                    data={cvData.personalInfo}
                                    onChange={(personalInfo) => updateCV({ personalInfo })}
                                />
                            )}
                            {activeTab === 'experience' && (
                                <ExperienceModule
                                    data={cvData.experience}
                                    onChange={(experience) => updateCV({ experience })}
                                />
                            )}
                            {activeTab === 'education' && (
                                <EducationModule
                                    data={cvData.education}
                                    onChange={(education) => updateCV({ education })}
                                />
                            )}
                            {activeTab === 'skills' && (
                                <SkillsModule
                                    data={cvData.skills}
                                    onChange={(skills) => updateCV({ skills })}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {viewMode === 'editor' && (
                    <AIAssistant currentCV={cvData} onUpdate={setCvData} />
                )}

                {viewMode === 'preview' && (
                    <div className="h-full overflow-y-auto bg-gray-100 rounded-xl border border-gray-200 shadow-inner p-8">
                        <CVPreview data={cvData} />
                    </div>
                )}
            </div>
        </div>
    );
}
