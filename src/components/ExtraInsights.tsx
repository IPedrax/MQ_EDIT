import { GraduationCap, MessageSquare } from 'lucide-react';
import { Carousel } from './Carousel';

interface InsightItem {
    id: string;
    title: string;
    description: string;
}

interface ExtraInsightsProps {
    studies: InsightItem[];
    tips: InsightItem[];
}

export function ExtraInsights({ studies, tips }: ExtraInsightsProps) {
    if (!studies.length && !tips.length) return null;

    return (
        <div className="space-y-6">
            {/* Extra Studies Section */}
            {studies.length > 0 && (
                <Carousel
                    title="Estudos e Certificações"
                    icon={<GraduationCap className="w-5 h-5 text-purple-600" />}
                    items={studies}
                    renderItem={(item) => (
                        <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
                            <h4 className="font-bold text-lg text-purple-900 mb-2">{item.title}</h4>
                            <p className="text-purple-800 leading-relaxed">{item.description}</p>
                        </div>
                    )}
                />
            )}

            {/* Interview Tips Section */}
            {tips.length > 0 && (
                <Carousel
                    title="Dicas para Entrevista"
                    icon={<MessageSquare className="w-5 h-5 text-orange-600" />}
                    items={tips}
                    renderItem={(item) => (
                        <div className="p-6 bg-orange-50 rounded-lg border border-orange-100">
                            <h4 className="font-bold text-lg text-orange-900 mb-2">{item.title}</h4>
                            <p className="text-orange-800 leading-relaxed">{item.description}</p>
                        </div>
                    )}
                />
            )}
        </div>
    );
}
