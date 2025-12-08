import { useState } from 'react';
import type { CVData } from '../../types/cv';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { editCVWithAI } from '../../lib/gemini';

interface AIAssistantProps {
    currentCV: CVData;
    onUpdate: (newData: CVData) => void;
}

export function AIAssistant({ currentCV, onUpdate }: AIAssistantProps) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const updatedCV = await editCVWithAI(currentCV, prompt);
            onUpdate(updatedCV);
            setPrompt('');
        } catch (error) {
            console.error('Error updating CV with AI:', error);
            alert('Erro ao atualizar o currículo com IA. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-purple-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Assistente IA</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Peça para a IA melhorar seu currículo, corrigir erros ou reescrever seções.
                <br />
                <span className="text-xs italic opacity-75">Ex: "Melhore meu resumo profissional", "Corrija erros de português na experiência"</span>
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Como posso ajudar a melhorar seu CV?"
                    className="flex-1 p-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </form>
        </div>
    );
}
