import { useState } from 'react';
import { Briefcase, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import type { CVData } from '../types/cv';
import { compareCVWithJob, type ComparisonResult } from '../lib/gemini';
import { useStore } from '../lib/store';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface JobComparisonProps {
    cvData?: CVData;
    suggestedJobs: any[];
    initialSpiderGraph?: any[];
}

export function JobComparison({ cvData, suggestedJobs, initialSpiderGraph }: JobComparisonProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [isComparing, setIsComparing] = useState(false);
    const [result, setResult] = useState<ComparisonResult | null>(null);
    const { spendTokens } = useStore();

    const handleCompare = async () => {
        if (!cvData) {
            alert("Por favor, carregue um currículo primeiro.");
            return;
        }

        if (!jobDescription.trim()) {
            alert("Por favor, insira a descrição da vaga.");
            return;
        }

        if (!spendTokens(2)) {
            alert("Você precisa de 2 tokens para realizar a comparação.");
            return;
        }

        setIsComparing(true);
        try {
            const comparison = await compareCVWithJob(cvData, jobDescription);
            setResult(comparison);
        } catch (error) {
            console.error("Erro na comparação:", error);
            alert("Erro ao comparar currículo com a vaga. Tente novamente.");
        } finally {
            setIsComparing(false);
        }
    };

    const chartData = result?.spiderGraph || initialSpiderGraph;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {chartData && chartData.length > 0 && (
                <div className="w-full h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="variable" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Seu Currículo"
                                dataKey="cvValue"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.5}
                            />
                            {result?.spiderGraph && (
                                <Radar
                                    name="Exigência da Vaga"
                                    dataKey="jobValue"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                            )}
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Comparador de Vagas</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selecione uma vaga sugerida ou cole a descrição:
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-sm"
                        onChange={(e) => setJobDescription(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Selecione uma vaga...</option>
                        {suggestedJobs.map((job, index) => (
                            <option key={index} value={`${job.title} ${job.searchQuery}`}>
                                {job.title} ({job.matchScore}% Match Inicial)
                            </option>
                        ))}
                    </select>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Cole aqui a descrição completa da vaga (requisitos, responsabilidades, etc)..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                    />
                </div>

                <button
                    onClick={handleCompare}
                    disabled={isComparing || !jobDescription}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isComparing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Comparando...
                        </>
                    ) : (
                        <>
                            Comparar Currículo
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {result && (
                    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="font-medium text-gray-700">Compatibilidade</span>
                            <span className={`text-2xl font-bold ${result.matchScore >= 75 ? 'text-green-600' : result.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {result.matchScore}%
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Análise
                            </h3>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {result.analysis}
                            </p>
                        </div>

                        {result.missingKeywords.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    Palavras-chave Ausentes
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((keyword, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-100 font-medium">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.improvements.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-900">Sugestões de Melhoria</h3>
                                <ul className="space-y-2">
                                    {result.improvements.map((item, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
