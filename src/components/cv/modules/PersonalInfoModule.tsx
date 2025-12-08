import type { CVData } from '../../../types/cv';

interface PersonalInfoModuleProps {
    data: CVData['personalInfo'];
    onChange: (data: CVData['personalInfo']) => void;
}

export function PersonalInfoModule({ data, onChange }: PersonalInfoModuleProps) {
    const handleChange = (field: keyof CVData['personalInfo'], value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Seu nome completo"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="seu@email.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="(00) 00000-0000"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Localização</label>
                    <input
                        type="text"
                        value={data.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Cidade, Estado"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                    <input
                        type="url"
                        value={data.linkedin || ''}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="URL do LinkedIn"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Site / Portfólio</label>
                    <input
                        type="url"
                        value={data.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="URL do seu site"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Resumo Profissional</label>
                <textarea
                    value={data.summary || ''}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Breve resumo sobre sua carreira e objetivos..."
                />
            </div>
        </div>
    );
}
