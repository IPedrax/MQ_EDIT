import { useState } from 'react';
import type { CVData } from './types/cv';
import { parseFile } from './lib/fileParser';
import { analyzeCV } from './lib/gemini';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
// import { DocumentEditor } from './components/DocumentEditor';
import { CVBuilder } from './components/cv/CVBuilder';
import { AdviceSection } from './components/AdviceSection';
import { SalaryValuation } from './components/SalaryValuation';
import { JobMatches } from './components/JobMatches';
import { JobComparison } from './components/JobComparison';
import { ExtraInsights } from './components/ExtraInsights';
import { Loader2, Send } from 'lucide-react';
import { useStore } from './lib/store';
import { sendToTalentAds } from './lib/talentAds';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [cvContent, setCvContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advice, setAdvice] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [valuation, setValuation] = useState(0);
  const [extraStudies, setExtraStudies] = useState<any[]>([]);
  const [interviewTips, setInterviewTips] = useState<any[]>([]);
  const [spiderGraph, setSpiderGraph] = useState<any[]>([]);
  const [cvData, setCvData] = useState<CVData | undefined>(undefined);

  const { spendTokens, addTokens } = useStore();

  const handleFileUpload = async (uploadedFile: File) => {
    // Check if user has tokens before processing
    if (!spendTokens(1)) {
      alert("Você não tem tokens suficientes para realizar uma nova análise. Por favor, adquira mais tokens.");
      return;
    }

    setFile(uploadedFile);
    setIsAnalyzing(true);

    try {
      const content = await parseFile(uploadedFile);
      setCvContent(content);

      // Perform AI Analysis
      const analysis = await analyzeCV(content);
      setAdvice(analysis.advice);
      setJobs(analysis.jobMatches);
      setValuation(analysis.valuation);
      setExtraStudies(analysis.extraStudies || []);
      setInterviewTips(analysis.interviewTips || []);
      setSpiderGraph(analysis.spiderGraph || []);
      if (analysis.cvData) {
        setCvData(analysis.cvData);
      }

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
    // Mock Netcred Payment Flow
    const confirmed = window.confirm("Você será redirecionado para o gateway de pagamento da Netcred. Deseja continuar?");
    if (confirmed) {
      // Simulate processing delay
      setTimeout(() => {
        const amount = window.prompt("Simulação Netcred: Pagamento Aprovado!\n\nQuantos tokens foram adquiridos?", "10");
        if (amount && !isNaN(Number(amount))) {
          addTokens(Number(amount));
          alert(`Sucesso! ${amount} tokens foram adicionados à sua carteira via Netcred.`);
        }
      }, 1000);
    }
  };

  const handleSendToTalentAds = async () => {
    if (!spendTokens(3)) {
      alert("Você precisa de 3 tokens para enviar seu currículo para o Talent Ads.");
      return;
    }

    const confirmed = window.confirm("Deseja enviar seu currículo para a base de talentos do Talent Ads? (Custo: 3 Tokens)");
    if (!confirmed) return;

    try {
      await sendToTalentAds(cvContent);
      alert("Currículo enviado com sucesso para o Talent Ads! Recrutadores entrarão em contato.");
    } catch (error) {
      alert("Erro ao enviar currículo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header onBuyTokens={handleBuyTokens} />

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
                <div className="lg:col-span-7 space-y-6 h-[800px]">
                  <CVBuilder initialData={cvData} />
                  <JobComparison cvData={cvData} suggestedJobs={jobs} initialSpiderGraph={spiderGraph} />
                </div>

                {/* Right Column: Analysis & Insights */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendToTalentAds}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Enviar para Talent Ads
                    </button>
                  </div>
                  <SalaryValuation valuation={valuation} />
                  <AdviceSection advice={advice} />
                  <ExtraInsights studies={extraStudies} tips={interviewTips} />
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
