export interface TalentAd {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    isPromoted: boolean;
}

export const MOCK_TALENT_ADS: TalentAd[] = [
    {
        id: 'ad-1',
        title: 'Desenvolvedor Full Stack Sênior',
        company: 'TechCorp (Talent Ads)',
        location: 'São Paulo, SP',
        url: 'https://talentads.com.br/vagas/123',
        isPromoted: true
    },
    {
        id: 'ad-2',
        title: 'Analista de Dados Pleno',
        company: 'DataSolutions (Talent Ads)',
        location: 'Rio de Janeiro, RJ',
        url: 'https://talentads.com.br/vagas/456',
        isPromoted: true
    }
];

export async function sendToTalentAds(cvContent: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Enviando CV para Talent Ads:", cvContent.substring(0, 50) + "...");
            resolve(true);
        }, 1500);
    });
}
