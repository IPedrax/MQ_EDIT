import { useState } from 'react';
import { parseFile } from './lib/fileParser';
import { analyzeCV } from './lib/gemini';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DocumentEditor } from './components/DocumentEditor';
import { AdviceSection } from './components/AdviceSection';
import { SalaryValuation } from './components/SalaryValuation';
import { JobMatches } from './components/JobMatches';
import { Loader2 } from 'lucide-react';

// Mock data removed as requested

function App() {
  const [tokens, setTokens] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvContent, setCvContent] = useState('');
  const [advice, setAdvice] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [valuation, setValuation] = useState(0);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);

    try {
      const content = await parseFile(uploadedFile);
      setCvContent(content);
      setTokens(prev => Math.max(0, prev - 1));

      // Perform AI Analysis
      const analysis = await analyzeCV(content);
      setAdvice(analysis.advice);
      setJobs(analysis.jobMatches);
      setValuation(analysis.valuation);

    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erro ao processar o arquivo: ${errorMessage}`);
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBuyTokens = () => {
    // Mock payment flow
    const amount = window.prompt("Quantos tokens deseja comprar? (Simulação)");
    if (amount && !isNaN(Number(amount))) {
      setTokens(prev => prev + Number(amount));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header tokens={tokens} onBuyTokens={handleBuyTokens} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!file ? (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">
                Otimize seu Currículo com IA
              </h1>
              <p className="text-lg text-gray-600">
                Receba análise detalhada, valoração salarial e vagas compatíveis em segundos.
                Potencializado pelo Gemini 2.5 Flash.
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-[600px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Analisando seu perfil...</h2>
                <p className="text-gray-500">Identificando pontos de melhoria e oportunidades.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Document Editor */}
                <div className="lg:col-span-7 space-y-6">
                  <DocumentEditor content={cvContent} onChange={setCvContent} />
                </div>

                {/* Right Column: Analysis & Insights */}
                <div className="lg:col-span-5 space-y-6">
                  <SalaryValuation valuation={valuation} />
                  <AdviceSection advice={advice} />
                  <JobMatches jobs={jobs} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
