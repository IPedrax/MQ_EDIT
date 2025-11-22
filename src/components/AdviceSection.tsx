import { Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Advice {
    id: string;
    type: 'improvement' | 'strength' | 'warning';
    title: string;
    description: string;
}

interface AdviceSectionProps {
    advice: Advice[];
}

export function AdviceSection({ advice }: AdviceSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Análise</h3>
            </div>

            <div className="grid gap-4">
                {advice.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "p-4 rounded-lg border-l-4 shadow-sm bg-white transition-all hover:shadow-md",
                            item.type === 'improvement' && "border-l-blue-500",
                            item.type === 'strength' && "border-l-green-500",
                            item.type === 'warning' && "border-l-yellow-500"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {item.type === 'improvement' && <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />}
                            {item.type === 'strength' && <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />}
                            {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}

                            <div>
                                <h4 className="font-medium text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
