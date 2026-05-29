"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  FieldError,
  FieldHint,
  FieldLabel,
  TextInput,
  Textarea,
} from "@/components/admin/shared/FormField";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createTestimonial,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import { uploadTestimonialPhoto } from "@/lib/actions/uploads";
import type { AdminTestimonial } from "@/lib/queries/testimonials";
import { TESTIMONIALS_LIST_KEY } from "@/hooks/testimonialKeys";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/utils/image-upload";
import {
  TestimonialInputSchema,
  type TestimonialInput,
} from "@/lib/validation/testimonial.schema";

const EMPTY: TestimonialInput = {
  name: "",
  role: "",
  rating: 5,
  text: "",
  photo_url: "",
  featured: false,
  status: "draft",
};

export function TestimoniModal({
  testimonial,
  open,
  onOpenChange,
  onRequestDelete,
}: {
  testimonial: AdminTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestDelete: (testimonial: AdminTestimonial) => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(testimonial);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<TestimonialInput>({
    resolver: standardSchemaResolver(TestimonialInputSchema),
    mode: "onTouched",
    defaultValues: EMPTY,
  });
  const { register, formState, setValue, watch, handleSubmit, reset, setError } =
    form;
  const errors = formState.errors;

  // Re-seed the form whenever a different testimonial opens.
  useEffect(() => {
    if (!open) return;
    reset(
      testimonial
        ? {
            name: testimonial.name,
            role: testimonial.role ?? "",
            rating: testimonial.rating,
            text: testimonial.text,
            photo_url: testimonial.photo_url ?? "",
            featured: testimonial.featured,
            status: testimonial.status,
          }
        : EMPTY,
    );
  }, [open, testimonial, reset]);

  const rating = watch("rating");
  const text = watch("text") ?? "";
  const photoUrl = watch("photo_url") ?? "";
  const featured = watch("featured");
  const status = watch("status");

  const onPhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setPhotoUploading(true);
    try {
      const result = await uploadTestimonialPhoto(file);
      if (!result.success) {
        // Non-blocking: the form still saves without a photo.
        toast.error(result.error);
        return;
      }
      setValue("photo_url", result.url, { shouldValidate: true });
    } finally {
      setPhotoUploading(false);
    }
  };

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, values)
        : await createTestimonial(values);
      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof TestimonialInput, {
              type: "server",
              message: messages[0],
            });
          }
        }
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "Testimoni diperbarui." : "Testimoni ditambahkan.");
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_LIST_KEY });
      onOpenChange(false);
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-0 p-0">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-[1.1rem] font-bold tracking-[-0.01em]">
            {isEdit ? "Edit Testimoni" : "Tambah Testimoni"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-5 py-5">
          {/* Photo + identity */}
          <div className="flex gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              aria-hidden
              tabIndex={-1}
              onChange={onPhotoPick}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              aria-label="Unggah foto"
              className={cn(
                "relative flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-full",
                "border border-dashed border-border bg-surface-muted text-foreground-muted",
                "transition-colors hover:border-primary hover:text-primary-dark",
              )}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Foto testimoni"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : photoUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" strokeWidth={2} />
                  <span className="font-mono text-[0.64rem]">foto · opsional</span>
                </>
              )}
            </button>

            <div className="flex flex-1 flex-col gap-3">
              <div>
                <FieldLabel htmlFor="t-name">Nama orang tua</FieldLabel>
                <TextInput
                  id="t-name"
                  placeholder="cth: Bunda Aiko"
                  aria-invalid={!!errors.name || undefined}
                  {...register("name")}
                />
                <FieldError id="err-t-name" message={errors.name?.message} />
              </div>
              <div>
                <FieldLabel htmlFor="t-role" optional>
                  Konteks (anak, kelas)
                </FieldLabel>
                <TextInput
                  id="t-role"
                  placeholder="cth: Anak 7 tahun · Kelas Privat"
                  {...register("role")}
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <FieldLabel>Rating</FieldLabel>
            <div
              role="radiogroup"
              aria-label="Rating bintang"
              className="flex items-center gap-1.5"
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const on = n <= rating;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={n === rating}
                    aria-label={`${n} dari 5 bintang`}
                    onClick={() =>
                      setValue("rating", n, { shouldValidate: true })
                    }
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7",
                        on
                          ? "fill-sun text-sun"
                          : "fill-transparent text-border",
                      )}
                      strokeWidth={2}
                    />
                  </button>
                );
              })}
              <span className="ml-1.5 font-mono text-[0.82rem] text-foreground-muted">
                {rating} / 5
              </span>
            </div>
            <FieldError id="err-t-rating" message={errors.rating?.message} />
          </div>

          {/* Text */}
          <div>
            <FieldLabel htmlFor="t-text">Isi testimoni</FieldLabel>
            <Textarea
              id="t-text"
              rows={4}
              placeholder="Diketik apa adanya — tanpa edit tata bahasa kecuali typo."
              aria-invalid={!!errors.text || undefined}
              {...register("text")}
            />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <FieldError id="err-t-text" message={errors.text?.message} />
              <span
                className={cn(
                  "ml-auto shrink-0 font-mono text-[0.76rem]",
                  text.length > 300
                    ? "text-accent-dark"
                    : "text-foreground-subtle",
                )}
              >
                {text.length} / 300
              </span>
            </div>
          </div>

          {/* Featured + status */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setValue("featured", !featured, { shouldValidate: true })
              }
              aria-pressed={featured}
              className={cn(
                "flex items-center justify-between gap-2 rounded-[12px] border border-border border-b-[3px] bg-surface px-3.5 py-3 text-left transition-colors",
                featured && "border-accent border-b-accent bg-accent-tint",
              )}
            >
              <span>
                <span className="block text-[0.88rem] font-bold text-foreground">
                  Unggulan
                </span>
                <span className="block text-[0.76rem] text-foreground-muted">
                  Tampilkan di landing
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                  featured ? "bg-accent" : "bg-border",
                )}
              >
                <span
                  className={cn(
                    "absolute h-4 w-4 rounded-full bg-surface transition-transform",
                    featured ? "translate-x-[18px]" : "translate-x-[2px]",
                  )}
                />
              </span>
            </button>

            <div className="rounded-[12px] border border-border border-b-[3px] bg-surface px-3.5 py-2.5">
              <span className="block text-[0.88rem] font-bold text-foreground">
                Status
              </span>
              <div
                role="radiogroup"
                aria-label="Status testimoni"
                className="mt-1.5 flex gap-1 rounded-[10px] bg-surface-muted p-1"
              >
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={status === s}
                    onClick={() => setValue("status", s, { shouldDirty: true })}
                    className={cn(
                      "flex-1 rounded-[7px] px-2 py-1.5 text-[0.78rem] font-bold transition-colors",
                      status === s
                        ? "bg-surface text-foreground shadow-[0_2px_0_var(--color-border)]"
                        : "text-foreground-muted hover:text-foreground",
                    )}
                  >
                    {s === "published" ? "Terbit" : "Draf"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FieldHint>
            Hanya testimoni dengan Unggulan aktif &amp; status Terbit yang
            tampil di landing.
          </FieldHint>

          {/* Footer */}
          <div className="-mx-5 -mb-5 mt-1 flex items-center justify-between gap-2 border-t border-border bg-surface-muted px-5 py-3.5">
            {isEdit && testimonial ? (
              <button
                type="button"
                onClick={() => onRequestDelete(testimonial)}
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-[0.84rem] font-bold text-accent transition-colors hover:bg-accent-tint"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                Hapus
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <ChunkyButton
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Batal
              </ChunkyButton>
              <ChunkyButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={pending}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                ) : null}
                Simpan
              </ChunkyButton>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
