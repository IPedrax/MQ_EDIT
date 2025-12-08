export interface CVData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        linkedin?: string;
        website?: string;
        location?: string;
        summary?: string;
    };
    experience: Array<{
        id: string;
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
    }>;
    education: Array<{
        id: string;
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate: string;
        current: boolean;
    }>;
    skills: string[];
    languages: Array<{
        id: string;
        language: string;
        proficiency: string;
    }>;
}
