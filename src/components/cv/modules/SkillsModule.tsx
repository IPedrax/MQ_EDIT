import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillsModuleProps {
    data: string[];
    onChange: (data: string[]) => void;
}

export function SkillsModule({ data, onChange }: SkillsModuleProps) {
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            onChange([...data, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Adicionar habilidade (ex: React, Node.js, Liderança)"
                />
                <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {data.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200 group hover:border-primary/50 transition-colors"
                    >
                        <span className="text-sm">{skill}</span>
                        <button
                            onClick={() => handleRemoveSkill(index)}
                            className="p-0.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Nenhuma habilidade adicionada ainda.</p>
                )}
            </div>
        </div>
    );
}
