

interface DocumentEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function DocumentEditor({ content, onChange }: DocumentEditorProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Editor de Currículo</h3>
                <span className="text-xs text-gray-500">Editável</span>
            </div>
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 w-full p-6 resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed text-gray-800"
                placeholder="O conteúdo do seu currículo aparecerá aqui..."
            />
        </div>
    );
}
