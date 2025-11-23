import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './EditorToolbar';
import { useEffect } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface DocumentEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function DocumentEditor({ content, onChange }: DocumentEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8 bg-white shadow-sm',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor content if external content changes (e.g. file upload)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (editor.isEmpty || !editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    const handleDownload = () => {
        const element = document.querySelector('.ProseMirror');
        if (!element) return;

        const opt = {
            margin: [10, 10],
            filename: 'meu-curriculo-otimizado.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        (html2pdf as any)().set(opt).from(element).save();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 text-sm">Editor de Currículo</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Modo Edição</span>
            </div>

            <EditorToolbar editor={editor} onDownload={handleDownload} />

            <div className="flex-1 overflow-y-auto bg-gray-100 p-8 cursor-text" onClick={() => editor?.chain().focus().run()}>
                <div className="max-w-[210mm] mx-auto bg-white shadow-lg min-h-[297mm]">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
}
