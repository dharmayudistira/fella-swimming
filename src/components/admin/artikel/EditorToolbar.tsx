"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Formatting toolbar for the Tiptap editor. Pure presentation — all state
 * lives in the editor instance; image upload is delegated to the parent
 * (which owns the file input + upload action).
 */
export function EditorToolbar({
  editor,
  onImageButton,
  onLinkButton,
  imageUploading,
}: {
  editor: Editor | null;
  onImageButton: () => void;
  onLinkButton: () => void;
  imageUploading: boolean;
}) {
  // Subscribe to the editor's selection/state so active marks re-render.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      strike: e?.isActive("strike") ?? false,
      link: e?.isActive("link") ?? false,
      h2: e?.isActive("heading", { level: 2 }) ?? false,
      h3: e?.isActive("heading", { level: 3 }) ?? false,
      bulletList: e?.isActive("bulletList") ?? false,
      orderedList: e?.isActive("orderedList") ?? false,
      blockquote: e?.isActive("blockquote") ?? false,
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) return null;

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-[16px] border-b border-border",
        "bg-surface px-2.5 py-2",
      )}
    >
      <Btn
        label="Judul H2"
        active={state.h2}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-[18px] w-[18px]" strokeWidth={2} />
      </Btn>
      <Btn
        label="Judul H3"
        active={state.h3}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-[18px] w-[18px]" strokeWidth={2} />
      </Btn>

      <Divider />

      <Btn
        label="Tebal"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </Btn>
      <Btn
        label="Miring"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </Btn>
      <Btn
        label="Coret"
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </Btn>
      <Btn label="Tautan" active={state.link} onClick={onLinkButton}>
        <Link2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>

      <Divider />

      <Btn
        label="Sisipkan gambar"
        onClick={onImageButton}
        disabled={imageUploading}
      >
        {imageUploading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={2} />
        ) : (
          <ImageIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        )}
      </Btn>

      <Divider />

      <Btn
        label="Daftar poin"
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>
      <Btn
        label="Daftar bernomor"
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>
      <Btn
        label="Kutipan"
        active={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>

      <Divider />

      <Btn
        label="Urungkan"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
      >
        <Undo2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>
      <Btn
        label="Ulangi"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
      >
        <Redo2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </Btn>
    </div>
  );
}

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      // Keep the editor selection when clicking a toolbar button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-foreground-muted transition-colors",
        "hover:bg-surface-muted hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        active &&
          "bg-primary-tint text-primary-dark shadow-[inset_0_0_0_1.5px_var(--color-primary)]",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px bg-border" />;
}
