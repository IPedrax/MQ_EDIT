import { TrendingUp } from 'lucide-react';

interface SalaryValuationProps {
    valuation: number;
}

export function SalaryValuation({ valuation }: SalaryValuationProps) {
    return (
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Valoração de Mercado</span>
            </div>

            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light opacity-80">R$</span>
                <span className="text-4xl font-bold tracking-tight">
                    {valuation.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            <p className="text-sm mt-4 opacity-80">
                Baseado na sua experiência e qualificações identificadas no currículo.
            </p>
        </div>
    );
}
