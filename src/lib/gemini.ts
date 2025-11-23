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
    suggestedText: string;
  }[];
  valuation: number;
  jobMatches: {
    id: string;
    title: string;
    source: 'Indeed';
    url: string;
    matchScore: number;
  }[];
  extraStudies: {
    id: string;
    title: string;
    description: string;
  }[];
  interviewTips: {
    id: string;
    title: string;
    description: string;
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
       - IMPORTANTE: Para cada conselho, forneça um "suggestedText": um texto profissional pronto para ser copiado e colado no currículo para aplicar a melhoria ou destacar o ponto forte.
       - NÃO sugira alterações em dados pessoais imutáveis.
    2. Uma estimativa de salário mensal em Reais (R$) baseada no mercado brasileiro.
       - SEJA REALISTA: Não limite artificialmente o valor. Para cargos de alta gestão ou TI sênior, valores acima de R$ 20.000,00 ou R$ 30.000,00 são comuns e devem ser refletidos se o currículo justificar.
    3. 3 sugestões de cargos/vagas compatíveis para buscar no Indeed.
       - Forneça APENAS o Título do cargo e os termos de busca ideais.
       - NÃO invente nomes de empresas ou locais.
    4. 3 sugestões de estudos extras ou certificações.
    5. 3 dicas práticas para entrevista.

    Currículo:
    ${text}

    Responda APENAS com um JSON válido no seguinte formato:
    {
      "advice": [
        { 
          "id": "1", 
          "type": "improvement", 
          "title": "...", 
          "description": "...", 
          "suggestedText": "Texto pronto para o CV..." 
        }
      ],
      "valuation": 12345.00,
      "jobMatches": [
        { 
          "id": "1", 
          "title": "...", 
          "searchQuery": "..." 
        }
      ],
      "extraStudies": [
        { "id": "1", "title": "...", "description": "..." }
      ],
      "interviewTips": [
        { "id": "1", "title": "...", "description": "..." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini Raw Response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair JSON da resposta do Gemini.");
    }

    const jsonString = jsonMatch[0];
    const data = JSON.parse(jsonString);

    const jobs = data.jobMatches.map((job: any) => ({
      ...job,
      source: 'Indeed',
      url: `https://br.indeed.com/jobs?q=${encodeURIComponent(job.searchQuery)}`,
      matchScore: Math.floor(Math.random() * (99 - 80) + 80)
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
