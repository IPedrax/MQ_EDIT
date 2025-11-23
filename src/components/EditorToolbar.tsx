import { type Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Download
} from 'lucide-react';
import { cn } from '../lib/utils';

interface EditorToolbarProps {
    editor: Editor | null;
    onDownload?: () => void;
}

export function EditorToolbar({ editor, onDownload }: EditorToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 text-gray-700"
                    title="Desfazer"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 text-gray-700"
                    title="Refazer"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('heading', { level: 1 }) && "bg-gray-200 text-primary"
                    )}
                    title="Título 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('heading', { level: 2 }) && "bg-gray-200 text-primary"
                    )}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('bold') && "bg-gray-200 text-primary"
                    )}
                    title="Negrito"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('italic') && "bg-gray-200 text-primary"
                    )}
                    title="Itálico"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('underline') && "bg-gray-200 text-primary"
                    )}
                    title="Sublinhado"
                >
                    <Underline className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive({ textAlign: 'left' }) && "bg-gray-200 text-primary"
                    )}
                    title="Alinhar à Esquerda"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive({ textAlign: 'center' }) && "bg-gray-200 text-primary"
                    )}
                    title="Centralizar"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive({ textAlign: 'right' }) && "bg-gray-200 text-primary"
                    )}
                    title="Alinhar à Direita"
                >
                    <AlignRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('bulletList') && "bg-gray-200 text-primary"
                    )}
                    title="Lista com Marcadores"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-gray-200 text-gray-700",
                        editor.isActive('orderedList') && "bg-gray-200 text-primary"
                    )}
                    title="Lista Numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
            </div>

            {onDownload && (
                <>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button
                        onClick={onDownload}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded hover:text-primary transition-colors"
                        title="Baixar PDF"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    );
}
