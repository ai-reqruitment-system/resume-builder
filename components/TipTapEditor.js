import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react';

const TipTapEditor = ({ value, onChange, className }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer hover:text-blue-700 transition-colors',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange({ target: { value: editor.getHTML() } });
        },
    });

    // Update content when value prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    const toggleBold = () => {
        editor.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
        editor.chain().focus().toggleItalic().run();
    };

    const toggleBulletList = () => {
        editor.chain().focus().toggleBulletList().run();
    };

    const toggleOrderedList = () => {
        editor.chain().focus().toggleOrderedList().run();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const undo = () => {
        editor.chain().focus().undo().run();
    };

    const redo = () => {
        editor.chain().focus().redo().run();
    };

    return (
        <div className={`tiptap-editor-wrapper border border-gray-200 rounded-xl overflow-hidden bg-white ${className}`}>
            <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-gray-200 bg-gray-50">
                <button
                    onClick={undo}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors`}
                    title="Undo"
                >
                    <Undo className="w-4 h-4 text-gray-700" />
                </button>
                <button
                    onClick={redo}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors`}
                    title="Redo"
                >
                    <Redo className="w-4 h-4 text-gray-700" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                <button
                    onClick={toggleBold}
                    className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'} transition-colors`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleItalic}
                    className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'} transition-colors`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                <button
                    onClick={toggleBulletList}
                    className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'} transition-colors`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleOrderedList}
                    className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'} transition-colors`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                <button
                    onClick={setLink}
                    className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'} transition-colors`}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>

            <EditorContent
                editor={editor}
                className="p-3 min-h-[250px] sm:min-h-[280px] md:min-h-[300px] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300 prose prose-sm max-w-none focus:outline-none"
            />

            <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          outline: none;
          height: 100%;
          min-height: 200px;
        }
        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor-wrapper .ProseMirror ul,
        .tiptap-editor-wrapper .ProseMirror ol {
          padding: 0 1rem;
        }
        .tiptap-editor-wrapper .ProseMirror ul li {
          list-style-type: disc;
        }
        .tiptap-editor-wrapper .ProseMirror ol li {
          list-style-type: decimal;
        }
      `}</style>
        </div>
    );
};

export default TipTapEditor;