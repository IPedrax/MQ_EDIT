import { useState } from 'react';
import type { CVData } from '../../../types/cv';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

interface EducationModuleProps {
    data: CVData['education'];
    onChange: (data: CVData['education']) => void;
}

export function EducationModule({ data, onChange }: EducationModuleProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = () => {
        const newEducation = {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            current: false
        };
        onChange([newEducation, ...data]);
        setExpandedId(newEducation.id);
    };

    const handleRemove = (id: string) => {
        onChange(data.filter(item => item.id !== id));
    };

    const handleChange = (id: string, field: keyof CVData['education'][0], value: any) => {
        onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={handleAdd}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus className="w-5 h-5" />
                Adicionar Formação
            </button>

            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <div
                            className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer select-none"
                            onClick={() => toggleExpand(item.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full border border-gray-200 text-primary">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.degree || 'Nova Formação'}</h3>
                                    <p className="text-sm text-gray-500">{item.institution || 'Instituição'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Remover"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {expandedId === item.id && (
                            <div className="p-4 border-t border-gray-200 space-y-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Instituição</label>
                                        <input
                                            type="text"
                                            value={item.institution}
                                            onChange={(e) => handleChange(item.id, 'institution', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: USP"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Grau / Curso</label>
                                        <input
                                            type="text"
                                            value={item.degree}
                                            onChange={(e) => handleChange(item.id, 'degree', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: Bacharelado em Ciência da Computação"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Área de Estudo</label>
                                        <input
                                            type="text"
                                            value={item.fieldOfStudy}
                                            onChange={(e) => handleChange(item.id, 'fieldOfStudy', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: Tecnologia"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Início</label>
                                            <input
                                                type="text"
                                                value={item.startDate}
                                                onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                placeholder="Ex: 2018"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Fim</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.endDate}
                                                    onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                                                    disabled={item.current}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                                    placeholder="Ex: 2022"
                                                />
                                                <div className="flex items-center gap-2 min-w-[80px]">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.current}
                                                        onChange={(e) => handleChange(item.id, 'current', e.target.checked)}
                                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-gray-600">Atual</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma formação adicionada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
