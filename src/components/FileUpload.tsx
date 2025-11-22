import { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            setError('Por favor, envie um arquivo PDF ou DOCX.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('O arquivo deve ter no máximo 5MB.');
            return false;
        }
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onFileUpload(file);
        }
    }, [onFileUpload]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onFileUpload(file);
        }
    }, [onFileUpload]);

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer group",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                    error && "border-red-300 bg-red-50"
                )}
            >
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className={cn(
                    "p-4 rounded-full bg-gray-100 mb-4 transition-colors group-hover:bg-primary/10",
                    isDragging && "bg-primary/20"
                )}>
                    <Upload className={cn(
                        "w-8 h-8 text-gray-400 group-hover:text-primary transition-colors",
                        isDragging && "text-primary"
                    )} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Arraste e solte seu currículo aqui
                </h3>
                <p className="text-gray-500 mb-6">
                    Suportamos arquivos PDF ou DOCX (max 5MB)
                </p>

                <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
                    Selecionar Arquivo
                </button>

                {error && (
                    <div className="absolute bottom-4 flex items-center gap-2 text-red-600 text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
