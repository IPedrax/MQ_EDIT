import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API Key not found. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key_to_prevent_crash_on_init");

export interface AnalysisResult {
  advice: {
    id: string;
    type: 'improvement' | 'strength' | 'warning';
    title: string;
    description: string;
  }[];
  valuation: number;
  jobMatches: {
    id: string;
    title: string;
    company: string;
    location: string;
    source: 'Indeed' | 'Glassdoor';
    url: string;
    matchScore: number;
  }[];
}

export async function analyzeCV(text: string): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error("Chave de API não configurada. Local: verifique .env. Produção: verifique GitHub Secrets (VITE_GEMINI_API_KEY).");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Você é um especialista em RH e recrutamento. Analise o seguinte currículo e forneça:
    1. 3 conselhos práticos (um de melhoria, um ponto forte, um alerta).
       - IMPORTANTE: NÃO sugira alterações em dados pessoais imutáveis como nome, idade, data de nascimento, gênero ou nacionalidade.
       - Foque estritamente em: experiência profissional, habilidades, educação, formatação, palavras-chave e impacto.
    2. Uma estimativa de salário mensal em Reais (R$) baseada no mercado brasileiro para este perfil.
    3. 3 sugestões de vagas compatíveis (Título, Empresa Fictícia ou Genérica, Localização (ESTADO/UF), e termos de busca para Indeed/Glassdoor).
       - IMPORTANTE: Para a localização, use o ESTADO (ex: São Paulo, Rio de Janeiro) ao invés de cidade específica, para ampliar a busca.

    Currículo:
    ${text}

    Responda APENAS com um JSON válido no seguinte formato, sem markdown e sem comentários:
    {
      "advice": [
        { "id": "1", "type": "improvement", "title": "...", "description": "..." },
        { "id": "2", "type": "strength", "title": "...", "description": "..." },
        { "id": "3", "type": "warning", "title": "...", "description": "..." }
      ],
      "valuation": 12345.00,
      "jobMatches": [
        { 
          "id": "1", 
          "title": "...", 
          "company": "...", 
          "location": "...", 
          "source": "Indeed", 
          "searchQuery": "..." 
        },
        { 
          "id": "2", 
          "title": "...", 
          "company": "...", 
          "location": "...", 
          "source": "Glassdoor", 
          "searchQuery": "..." 
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini Raw Response:", responseText);

    // Robust JSON extraction: find the first '{' and the last '}'
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair JSON da resposta do Gemini.");
    }

    const jsonString = jsonMatch[0];
    const data = JSON.parse(jsonString);

    // Transform job matches to include real URLs based on search queries
    // Indeed: l=State
    // Glassdoor: locKeyword=State
    const jobs = data.jobMatches.map((job: any) => ({
      ...job,
      url: job.source === 'Indeed'
        ? `https://br.indeed.com/jobs?q=${encodeURIComponent(job.searchQuery)}&l=${encodeURIComponent(job.location)}`
        : `https://www.glassdoor.com.br/Job/jobs.htm?sc.keyword=${encodeURIComponent(job.searchQuery)}&locKeyword=${encodeURIComponent(job.location)}`,
      matchScore: Math.floor(Math.random() * (99 - 80) + 80) // Simulate match score
    }));

    return {
      ...data,
      jobMatches: jobs
    };
  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw error;
  }
}
