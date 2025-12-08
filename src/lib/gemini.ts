import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CVData } from "../types/cv";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API Key not found. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key_to_prevent_crash_on_init");

export interface AnalysisResult {
  cvData: CVData;
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
  spiderGraph: {
    variable: string;
    cvValue: number;
    quadrant: string;
  }[];
}

export async function analyzeCV(text: string): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error("Chave de API não configurada. Local: verifique .env. Produção: verifique GitHub Secrets (VITE_GEMINI_API_KEY).");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Você é um especialista em RH e recrutamento. Analise o seguinte currículo e forneça:
    1. Extraia TODOS os dados do currículo para um formato JSON estruturado (cvData).
       - Tente preencher o máximo de campos possível.
       - Para datas, use o formato "YYYY-MM" ou "Presente".
       - Se não encontrar informação, deixe como string vazia ou array vazio.
    2. 3 conselhos práticos (um de melhoria, um ponto forte, um alerta).
       - IMPORTANTE: Para cada conselho, forneça um "suggestedText": um texto profissional pronto para ser copiado e colado no currículo para aplicar a melhoria ou destacar o ponto forte.
       - NÃO sugira alterações em dados pessoais imutáveis.
    3. Uma estimativa de salário mensal em Reais (R$) baseada no mercado brasileiro.
       - SEJA REALISTA: Não limite artificialmente o valor. Para cargos de alta gestão ou TI sênior, valores acima de R$ 20.000,00 ou R$ 30.000,00 são comuns e devem ser refletidos se o currículo justificar.
    4. 3 sugestões de cargos/vagas compatíveis para buscar no Indeed.
       - As vagas devem ser compatíveis com a "valuation" (estimativa salarial) e senioridade do currículo.
       - Forneça APENAS vagas com compatibilidade (matchScore) acima de 75%.
       - Forneça o Título do cargo, os termos de busca ideais e o matchScore (0-100).
       - NÃO invente nomes de empresas ou locais.
    5. 3 sugestões de estudos extras ou certificações.
    6. 3 dicas práticas para entrevista.
    7. Gráfico Aranha (Spider Graph) do Perfil: Avalie 12 variáveis em 4 quadrantes. Atribua uma nota de 0 a 100 para o CV (cvValue).
       - Quadrante "Cultura": Valores/Ético, Propósito, Cultura/Ambiente.
       - Quadrante "Operacional": Técnico, Ritmo/Estilo, Time/Equipe.
       - Quadrante "Carreira": Liderança, Carreira, Impacto.
       - Quadrante "Condições Estruturais": Condições, Socioemocionais, Personalidade.

    Currículo:
    ${text}

    Responda APENAS com um JSON válido no seguinte formato:
    {
      "cvData": {
        "personalInfo": {
          "fullName": "...",
          "email": "...",
          "phone": "...",
          "linkedin": "...",
          "website": "...",
          "location": "...",
          "summary": "..."
        },
        "experience": [
          { "id": "1", "company": "...", "position": "...", "startDate": "...", "endDate": "...", "current": false, "description": "..." }
        ],
        "education": [
          { "id": "1", "institution": "...", "degree": "...", "fieldOfStudy": "...", "startDate": "...", "endDate": "...", "current": false }
        ],
        "skills": ["..."],
        "languages": [
          { "id": "1", "language": "...", "proficiency": "..." }
        ]
      },
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
          "searchQuery": "...",
          "matchScore": 85
        }
      ],
      "extraStudies": [
        { "id": "1", "title": "...", "description": "..." }
      ],
      "interviewTips": [
        { "id": "1", "title": "...", "description": "..." }
      ],
      "spiderGraph": [
        { "variable": "Valores/Ético", "cvValue": 80, "quadrant": "Cultura" },
        { "variable": "Propósito", "cvValue": 70, "quadrant": "Cultura" },
        { "variable": "Cultura/Ambiente", "cvValue": 85, "quadrant": "Cultura" },
        { "variable": "Técnico", "cvValue": 90, "quadrant": "Operacional" },
        { "variable": "Ritmo/Estilo", "cvValue": 75, "quadrant": "Operacional" },
        { "variable": "Time/Equipe", "cvValue": 85, "quadrant": "Operacional" },
        { "variable": "Liderança", "cvValue": 60, "quadrant": "Carreira" },
        { "variable": "Carreira", "cvValue": 80, "quadrant": "Carreira" },
        { "variable": "Impacto", "cvValue": 75, "quadrant": "Carreira" },
        { "variable": "Condições", "cvValue": 90, "quadrant": "Condições Estruturais" },
        { "variable": "Socioemocionais", "cvValue": 80, "quadrant": "Condições Estruturais" },
        { "variable": "Personalidade", "cvValue": 85, "quadrant": "Condições Estruturais" }
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
      matchScore: job.matchScore || Math.floor(Math.random() * (99 - 80) + 80) // Fallback if AI forgets
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

export async function editCVWithAI(currentCV: CVData, instruction: string): Promise<CVData> {
  if (!API_KEY) {
    throw new Error("Chave de API não configurada.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Você é um assistente de edição de currículos.
    
    Currículo Atual (JSON):
    ${JSON.stringify(currentCV, null, 2)}

    Instrução do Usuário:
    "${instruction}"

    Tarefa:
    1. Analise a instrução do usuário.
    2. Modifique o JSON do currículo para atender à instrução.
    3. Se a instrução for para corrigir erros, corrija ortografia e gramática em todos os campos de texto.
    4. Se a instrução for para melhorar o texto, torne-o mais profissional e impactante.
    5. Mantenha a estrutura exata do JSON.
    6. Retorne APENAS o JSON válido atualizado.

    Resposta (JSON):
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini Edit Response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair JSON da resposta do Gemini.");
    }

    const jsonString = jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error editing CV with AI:", error);
    throw error;
  }
}

export interface ComparisonResult {
  matchScore: number;
  missingKeywords: string[];
  improvements: string[];
  analysis: string;
  spiderGraph: {
    variable: string;
    cvValue: number;
    jobValue: number;
    quadrant: string;
  }[];
}

export async function compareCVWithJob(cvData: CVData, jobDescription: string): Promise<ComparisonResult> {
  if (!API_KEY) {
    throw new Error("Chave de API não configurada.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Você é um especialista em Recrutamento e Seleção (ATS).
    
    Compare o seguinte Currículo com a Descrição da Vaga.
    
    Currículo (JSON):
    ${JSON.stringify(cvData, null, 2)}

    Descrição da Vaga:
    "${jobDescription}"

    Forneça uma análise detalhada em Português do Brasil:
    1. Match Score (0-100%): Quão bem o candidato se encaixa na vaga?
    2. Palavras-chave ausentes: Quais habilidades ou termos importantes da vaga não estão no CV?
    3. Sugestões de melhoria: O que o candidato deve adicionar ou alterar no CV para aumentar suas chances?
    4. Análise geral: Um breve resumo da compatibilidade.
    5. Gráfico Aranha (Spider Graph): Avalie 12 variáveis em 4 quadrantes. Para cada variável, atribua uma nota de 0 a 100 para o CV (cvValue) e para a exigência da Vaga (jobValue).
       - Quadrante "Cultura": Valores/Ético, Propósito, Cultura/Ambiente.
       - Quadrante "Operacional": Técnico, Ritmo/Estilo, Time/Equipe.
       - Quadrante "Carreira": Liderança, Carreira, Impacto.
       - Quadrante "Condições Estruturais": Condições, Socioemocionais, Personalidade.

    Responda APENAS com um JSON válido no seguinte formato:
    {
      "matchScore": 85,
      "missingKeywords": ["Java", "AWS", "Scrum"],
      "improvements": ["Adicionar experiência com nuvem", "Destacar liderança de equipe"],
      "analysis": "O candidato tem forte base técnica...",
      "spiderGraph": [
        { "variable": "Valores/Ético", "cvValue": 80, "jobValue": 90, "quadrant": "Cultura" },
        { "variable": "Propósito", "cvValue": 70, "jobValue": 80, "quadrant": "Cultura" },
        { "variable": "Cultura/Ambiente", "cvValue": 85, "jobValue": 85, "quadrant": "Cultura" },
        { "variable": "Técnico", "cvValue": 90, "jobValue": 95, "quadrant": "Operacional" },
        { "variable": "Ritmo/Estilo", "cvValue": 75, "jobValue": 80, "quadrant": "Operacional" },
        { "variable": "Time/Equipe", "cvValue": 85, "jobValue": 80, "quadrant": "Operacional" },
        { "variable": "Liderança", "cvValue": 60, "jobValue": 70, "quadrant": "Carreira" },
        { "variable": "Carreira", "cvValue": 80, "jobValue": 80, "quadrant": "Carreira" },
        { "variable": "Impacto", "cvValue": 75, "jobValue": 85, "quadrant": "Carreira" },
        { "variable": "Condições", "cvValue": 90, "jobValue": 90, "quadrant": "Condições Estruturais" },
        { "variable": "Socioemocionais", "cvValue": 80, "jobValue": 85, "quadrant": "Condições Estruturais" },
        { "variable": "Personalidade", "cvValue": 85, "jobValue": 80, "quadrant": "Condições Estruturais" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini Comparison Response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair JSON da resposta do Gemini.");
    }

    const jsonString = jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error comparing CV with Job:", error);
    throw error;
  }
}
