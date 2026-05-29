"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { uploadArticleImage } from "@/lib/actions/uploads";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/utils/image-upload";
import type { Json } from "@/types/database.types";

import { EditorToolbar } from "./EditorToolbar";
import { LinkDialog } from "./LinkDialog";

export function TiptapEditor({
  initialContent,
  onChange,
}: {
  /** Stored `content_html` for edit mode; empty for a new article. */
  initialContent?: string;
  onChange: (content: Json, html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkDialog, setLinkDialog] = useState({
    open: false,
    text: "",
    url: "",
    isEdit: false,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // StarterKit v3 bundles Link + Underline — configure, don't re-add.
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer ugc", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-[12px]" } }),
      Placeholder.configure({ placeholder: "Tulis artikelmu di sini…" }),
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class: cn(
          "prose-fs min-h-[340px] px-5 py-4 outline-none",
          "focus:outline-none",
        ),
      },
    },
    onUpdate: ({ editor: e }) => {
      // Emit JSON for the `content` column and HTML for `content_html`.
      // A single boundary assertion: Tiptap's JSONContent is structurally Json.
      onChange(e.getJSON() as Json, e.isEmpty ? "" : e.getHTML());
    },
  });

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file || !editor) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadArticleImage(file);
      if (!result.success) {
        toast.error(result.error);
        return; // do NOT insert a broken image node on failure
      }
      const alt = file.name.replace(/\.[^.]+$/, "");
      editor.chain().focus().setImage({ src: result.url, alt }).run();
    } catch (err) {
      console.error("[TiptapEditor] image upload failed", err);
      toast.error("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const openLinkDialog = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    const href = (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkDialog({
      open: true,
      text: selectedText,
      url: href,
      isEdit: Boolean(href),
    });
  };

  const applyLink = (text: string, rawUrl: string) => {
    if (!editor) return;
    let href = rawUrl.trim();
    // Default to https:// when the user omits a scheme (but keep relative
    // links and in-page anchors as-is).
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      href = `https://${href}`;
    }
    const label = text.trim() || href;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .insertContent({
        type: "text",
        text: label,
        marks: [{ type: "link", attrs: { href } }],
      })
      .run();
    setLinkDialog((s) => ({ ...s, open: false }));
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDialog((s) => ({ ...s, open: false }));
  };

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface">
      <EditorToolbar
        editor={editor}
        onImageButton={handlePickImage}
        onLinkButton={openLinkDialog}
        imageUploading={uploading}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
        aria-hidden
        tabIndex={-1}
      />
      <EditorContent editor={editor} />

      {linkDialog.open ? (
        <LinkDialog
          open
          initialText={linkDialog.text}
          initialUrl={linkDialog.url}
          isEdit={linkDialog.isEdit}
          onOpenChange={(open) => setLinkDialog((s) => ({ ...s, open }))}
          onApply={applyLink}
          onRemove={removeLink}
        />
      ) : null}
    </div>
  );
}
