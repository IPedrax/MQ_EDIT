import { Lightbulb, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import { Carousel } from './Carousel';

interface AdviceItem {
    id: string;
    type: 'improvement' | 'strength' | 'warning';
    title: string;
    description: string;
    suggestedText?: string;
}

interface AdviceSectionProps {
    advice: AdviceItem[];
}

export function AdviceSection({ advice }: AdviceSectionProps) {
    if (!advice.length) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'improvement': return <Lightbulb className="w-6 h-6 text-amber-500" />;
            case 'strength': return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-red-500" />;
            default: return <Lightbulb className="w-6 h-6 text-gray-500" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'improvement': return 'bg-amber-50 border-amber-100 text-amber-900';
            case 'strength': return 'bg-green-50 border-green-100 text-green-900';
            case 'warning': return 'bg-red-50 border-red-100 text-red-900';
            default: return 'bg-gray-50 border-gray-100 text-gray-900';
        }
    };

    return (
        <Carousel
            title="Análise do Especialista"
            icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
            items={advice}
            renderItem={(item) => (
                <div className={`p-6 rounded-lg border ${getColor(item.type)}`}>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                            <p className="text-sm opacity-90 leading-relaxed mb-4">{item.description}</p>

                            {item.suggestedText && (
                                <div className="bg-white/50 p-3 rounded border border-black/5">
                                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Sugestão para o CV:</p>
                                    <p className="text-sm italic mb-2">"{item.suggestedText}"</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.suggestedText || "");
                                            alert("Texto sugerido copiado para a área de transferência!");
                                        }}
                                        className="flex items-center gap-1.5 text-xs font-bold bg-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
                                    >
                                        <Copy className="w-3 h-3" />
                                        Copiar Sugestão
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
