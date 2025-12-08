import type { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export function CVPreview({ data }: { data: CVData }) {
    return (
        <div className="bg-white shadow-lg min-h-[297mm] w-full max-w-[210mm] mx-auto p-[20mm] text-gray-800 font-sans text-sm leading-relaxed">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">{data.personalInfo.fullName || 'Seu Nome'}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 text-xs">
                    {data.personalInfo.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{data.personalInfo.email}</span>
                        </div>
                    )}
                    {data.personalInfo.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{data.personalInfo.phone}</span>
                        </div>
                    )}
                    {data.personalInfo.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{data.personalInfo.location}</span>
                        </div>
                    )}
                    {data.personalInfo.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                    {data.personalInfo.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Resumo Profissional</h2>
                    <p className="text-gray-700 whitespace-pre-line">{data.personalInfo.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Experiência Profissional</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-800 text-base">{exp.position}</h3>
                                    <span className="text-gray-500 text-xs font-medium">
                                        {exp.startDate} - {exp.current ? 'Atual' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-gray-700 font-medium mb-1">{exp.company}</div>
                                <p className="text-gray-600 whitespace-pre-line text-xs">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Formação Acadêmica</h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-800 text-base">{edu.institution}</h3>
                                    <span className="text-gray-500 text-xs font-medium">
                                        {edu.startDate} - {edu.current ? 'Atual' : edu.endDate}
                                    </span>
                                </div>
                                <div className="text-gray-700">
                                    {edu.degree} {edu.fieldOfStudy && `em ${edu.fieldOfStudy}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Habilidades</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
