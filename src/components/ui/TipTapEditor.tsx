"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Table, TableView } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

/* ── Toolbar Button ── */
const Btn = ({
    onClick, active, title, children,
}: {
    onClick: () => void; active?: boolean; title?: string; children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        onMouseDown={e => { e.preventDefault(); onClick(); }}
        style={{
            padding: '4px 7px',
            borderRadius: '4px',
            border: active ? '1px solid #0B4222' : '1px solid transparent',
            background: active ? '#e6f4ee' : 'transparent',
            color: active ? '#0B4222' : '#374151',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
        }}
    >
        {children}
    </button>
);

/* ── Divider ── */
const Sep = () => (
    <span style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px', display: 'inline-block' }} />
);

/* ════════════════════════════════════════════
   TIPTAP EDITOR
   Usage:
     <TipTapEditor value={html} onChange={setHtml} minHeight={300} />
════════════════════════════════════════════ */
export function TipTapEditor({
    value,
    onChange,
    placeholder = 'লিখুন...',
    minHeight = 250,
    simple = false,
}: {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
    simple?: boolean;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            Image,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value || '',
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                style: `min-height:${minHeight}px; padding:14px 16px; outline:none; font-size:14px; color:#1a1a1a; line-height:1.7;`,
            },
        },
        // @ts-ignore - TableView needed for resizable columns
        nodeViews: {
            table: (node: any, view: any, getPos: any) => new TableView(node, 24),
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL লিখুন:');
        if (url && editor) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const setLink = useCallback(() => {
        const prev = editor?.getAttributes('link').href;
        const url = window.prompt('URL:', prev || '');
        if (url === null) return;
        if (url === '') { editor?.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>

            {/* ── Toolbar ── */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '2px', alignItems: 'center',
                padding: '6px 10px', borderBottom: '1px solid #f3f4f6',
                background: '#fafafa',
            }}>
                {/* Headings */}
                {!simple && (<>
                    <select
                        value={
                            editor.isActive('heading', { level: 1 }) ? '1' :
                            editor.isActive('heading', { level: 2 }) ? '2' :
                            editor.isActive('heading', { level: 3 }) ? '3' :
                            editor.isActive('heading', { level: 4 }) ? '4' : '0'
                        }
                        onChange={e => {
                            const v = Number(e.target.value);
                            if (v === 0) editor.chain().focus().setParagraph().run();
                            else editor.chain().focus().toggleHeading({ level: v as 1|2|3|4 }).run();
                        }}
                        style={{ fontSize: '12px', padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: '4px', background: '#fff', cursor: 'pointer', marginRight: '4px' }}
                    >
                        <option value="0">Normal</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                        <option value="4">H4</option>
                    </select>
                    <Sep />
                </>)}

                {/* Basic formatting */}
                <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><b>B</b></Btn>
                <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><i>I</i></Btn>
                <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><u>U</u></Btn>
                <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></Btn>
                <Sep />

                {/* Color */}
                <label title="Text Color" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '13px', color: '#374151', marginRight: '2px' }}>A</span>
                    <input type="color" defaultValue="#000000"
                        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
                        style={{ width: '18px', height: '18px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '2px' }}
                    />
                </label>
                <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} active={editor.isActive('highlight')} title="Highlight">🖊</Btn>
                <Sep />

                {/* Lists */}
                <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">• List</Btn>
                <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">1. List</Btn>
                <Sep />

                {/* Align */}
                {!simple && (<>
                    <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">⬱</Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">≡</Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">⬰</Btn>
                    <Sep />
                </>)}

                {/* Link & Image */}
                <Btn onClick={setLink} active={editor.isActive('link')} title="Link">🔗</Btn>
                {!simple && <Btn onClick={addImage} title="Image">🖼</Btn>}
                <Sep />

                {/* Blockquote & Code */}
                {!simple && (<>
                    <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">❝</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{'</>'}</Btn>
                    <Sep />
                </>)}

                {/* ══ TABLE (only in full mode) ══ */}
                {!simple && (<>
                    <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table (3×3)">⊞ Table</Btn>
                    {editor.can().addColumnBefore() && (
                        <Btn onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before">+Col←</Btn>
                    )}
                    {editor.can().addColumnAfter() && (
                        <Btn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column After">+Col→</Btn>
                    )}
                    {editor.can().deleteColumn() && (
                        <Btn onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column">-Col</Btn>
                    )}
                    {editor.can().addRowBefore() && (
                        <Btn onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before">+Row↑</Btn>
                    )}
                    {editor.can().addRowAfter() && (
                        <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row After">+Row↓</Btn>
                    )}
                    {editor.can().deleteRow() && (
                        <Btn onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">-Row</Btn>
                    )}
                    {editor.can().deleteTable() && (
                        <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">🗑 Table</Btn>
                    )}
                    <Sep />
                </>)}

                {/* Undo/Redo + Clear */}
                <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</Btn>
                <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</Btn>
                <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">✕</Btn>
            </div>

            {/* ── Editor Area ── */}
            <EditorContent editor={editor} />

            {/* ── Table Styles ── */}
            <style>{`
                .ProseMirror table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 12px 0;
                }
                .ProseMirror th, .ProseMirror td {
                    border: 1px solid #d1d5db;
                    padding: 8px 12px;
                    min-width: 80px;
                    font-size: 13.5px;
                }
                .ProseMirror th {
                    background: #f3f4f6;
                    font-weight: 700;
                    text-align: left;
                }
                .ProseMirror .selectedCell:after {
                    background: rgba(11, 66, 34, 0.12);
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    pointer-events: none;
                    position: absolute;
                    z-index: 2;
                }
                .ProseMirror p { margin: 0 0 6px 0; }
                .ProseMirror h1 { font-size: 22px; font-weight: 700; margin: 12px 0 6px; }
                .ProseMirror h2 { font-size: 18px; font-weight: 700; margin: 10px 0 5px; }
                .ProseMirror h3 { font-size: 15px; font-weight: 700; margin: 8px 0 4px; }
                .ProseMirror ul { padding-left: 20px; }
                .ProseMirror ol { padding-left: 20px; }
                .ProseMirror blockquote { border-left: 3px solid #0B4222; padding-left: 12px; color: #555; margin: 10px 0; }
                .ProseMirror pre { background: #1e1e1e; color: #d4d4d4; padding: 12px 16px; border-radius: 6px; font-size: 13px; }
                .ProseMirror a { color: #0B4222; text-decoration: underline; }
                .ProseMirror img { max-width: 100%; border-radius: 6px; }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #9ca3af;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
