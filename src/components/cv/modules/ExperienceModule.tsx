import { useState } from 'react';
import type { CVData } from '../../../types/cv';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

interface ExperienceModuleProps {
    data: CVData['experience'];
    onChange: (data: CVData['experience']) => void;
}

export function ExperienceModule({ data, onChange }: ExperienceModuleProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = () => {
        const newExperience = {
            id: crypto.randomUUID(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        onChange([newExperience, ...data]);
        setExpandedId(newExperience.id);
    };

    const handleRemove = (id: string) => {
        onChange(data.filter(item => item.id !== id));
    };

    const handleChange = (id: string, field: keyof CVData['experience'][0], value: any) => {
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
                Adicionar Experiência
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
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.position || 'Nova Posição'}</h3>
                                    <p className="text-sm text-gray-500">{item.company || 'Empresa'}</p>
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
                                        <label className="text-sm font-medium text-gray-700">Cargo</label>
                                        <input
                                            type="text"
                                            value={item.position}
                                            onChange={(e) => handleChange(item.id, 'position', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: Desenvolvedor Senior"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Empresa</label>
                                        <input
                                            type="text"
                                            value={item.company}
                                            onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: Google"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Início</label>
                                        <input
                                            type="text"
                                            value={item.startDate}
                                            onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="Ex: Jan 2020"
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
                                                placeholder="Ex: Dez 2022"
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
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                        rows={4}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                        placeholder="Descreva suas responsabilidades e conquistas..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma experiência adicionada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
