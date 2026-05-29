"use client";

import { useState } from "react";

import {
  FieldHint,
  FieldLabel,
  TextInput,
} from "@/components/admin/shared/FormField";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LinkDialog({
  open,
  initialText,
  initialUrl,
  isEdit,
  onOpenChange,
  onApply,
  onRemove,
}: {
  open: boolean;
  initialText: string;
  initialUrl: string;
  isEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (text: string, url: string) => void;
  onRemove: () => void;
}) {
  // Seeded on mount; the parent mounts this only while open (and unmounts on
  // close), so each open starts from the current selection's text/url.
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() === "") return;
    onApply(text, url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-0 p-0">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-[1.05rem] font-bold tracking-[-0.01em]">
            {isEdit ? "Edit tautan" : "Sisipkan tautan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-3.5 px-5 py-5">
          <div>
            <FieldLabel htmlFor="link-text" optional>
              Teks tautan
            </FieldLabel>
            <TextInput
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="cth: lihat jenis kelas kami"
            />
            <FieldHint>Kosongkan untuk memakai URL sebagai teks.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="link-url">URL</FieldLabel>
            <TextInput
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://… atau /#jenis-kelas"
              autoFocus
              inputMode="url"
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            {isEdit ? (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center rounded-[10px] px-3 py-2 text-[0.84rem] font-bold text-accent transition-colors hover:bg-accent-tint"
              >
                Hapus tautan
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <ChunkyButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </ChunkyButton>
              <ChunkyButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={url.trim() === ""}
              >
                Simpan
              </ChunkyButton>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
