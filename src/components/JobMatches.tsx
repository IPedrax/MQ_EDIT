import { Briefcase, ExternalLink, Search } from 'lucide-react';
import { Carousel } from './Carousel';

interface JobMatch {
    id: string;
    title: string;
    source: string;
    url: string;
    matchScore: number;
}

interface JobMatchesProps {
    jobs: JobMatch[];
}

export function JobMatches({ jobs }: JobMatchesProps) {
    if (!jobs.length) return null;

    return (
        <Carousel
            title="Vagas Compatíveis (Indeed)"
            icon={<Briefcase className="w-5 h-5 text-blue-600" />}
            items={jobs}
            renderItem={(job) => (
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Search className="w-3 h-3" />
                                <span>Busca sugerida no Indeed</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.matchScore >= 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {job.matchScore}% Match
                        </span>
                    </div>

                    <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Buscar Vaga <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            )}
        />
    );
}
