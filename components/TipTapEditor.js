import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react';

const TipTapEditor = ({ value, onChange, className, toolbarButtons }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-teal-500 underline cursor-pointer hover:text-teal-700 transition-colors',
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
            <div className="flex flex-wrap items-center justify-between gap-1 p-2 sm:p-1 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap items-center gap-1 sm:gap-0.5">
                    <button
                        onClick={undo}
                        className={`p-1 sm:p-1.5 rounded hover:bg-gray-200 transition-colors`}
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

                    <div className="w-px h-6 sm:h-5 bg-gray-300 mx-2 sm:mx-1"></div>

                    <button
                        onClick={toggleBold}
                        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-200'} transition-colors`}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleItalic}
                        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-200'} transition-colors`}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 sm:h-5 bg-gray-300 mx-2 sm:mx-1"></div>

                    <button
                        onClick={toggleBulletList}
                        className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-200'} transition-colors`}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleOrderedList}
                        className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-200'} transition-colors`}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    {/* Link button removed as requested */}
                </div>

                {/* Additional toolbar buttons */}
                {toolbarButtons && (
                    <div className="flex items-center gap-1">
                        {toolbarButtons}
                    </div>
                )}
            </div>

            <EditorContent
                editor={editor}
                className="p-2 sm:p-3 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all duration-300 prose prose-xs max-w-none focus:outline-none h-full overflow-y-auto"
            />

            <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          outline: none;
          height: 100%;
          min-height: 200px;
          max-height: 100%;
          overflow-y: auto;
          font-size: 0.875rem;
          line-height: 1.4;
        }
        .tiptap-editor-wrapper .ProseMirror p {
          font-size: 1rem;
          line-height: 1.5;
          @media (min-width: 640px) {
            font-size: 0.875rem;
            line-height: 1.4;
          }
          margin: 0.5em 0;
        }
        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
          font-size: 0.875rem;
        }
        .tiptap-editor-wrapper .ProseMirror ul,
        .tiptap-editor-wrapper .ProseMirror ol {
          padding: 0 1.25rem;
          font-size: 1rem;
          @media (min-width: 640px) {
            padding: 0 1rem;
            font-size: 0.875rem;
          }
        }
        .tiptap-editor-wrapper .ProseMirror ul li {
          list-style-type: disc;
          font-size: 1rem;
          @media (min-width: 640px) {
            font-size: 0.875rem;
          }
        }
        .tiptap-editor-wrapper .ProseMirror ol li {
          list-style-type: decimal;
          font-size: 1rem;
          @media (min-width: 640px) {
            font-size: 0.875rem;
          }
        }
      `}</style>
        </div>
    );
};

export default TipTapEditor;