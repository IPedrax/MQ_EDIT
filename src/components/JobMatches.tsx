import { Briefcase, ExternalLink, MapPin } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    source: 'Indeed' | 'Glassdoor';
    url: string;
    matchScore: number;
}

interface JobMatchesProps {
    jobs: Job[];
}

export function JobMatches({ jobs }: JobMatchesProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Vagas Compatíveis</h3>
            </div>

            <div className="grid gap-3">
                {jobs.map((job) => (
                    <a
                        key={job.id}
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                    {job.title}
                                </h4>
                                <div className="text-sm text-gray-500 mt-1">{job.company}</div>

                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {job.location}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full ${job.source === 'Indeed' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                        }`}>
                                        {job.source}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="text-sm font-bold text-green-600">
                                    {job.matchScore}% Match
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
