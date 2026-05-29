"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  Loader2,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ArticleStatusBadge } from "@/components/admin/artikel/ArticleStatusBadge";
import { TiptapEditor } from "@/components/admin/artikel/TiptapEditor";
import {
  FieldError,
  FieldHint,
  FieldLabel,
  TextInput,
  Textarea,
} from "@/components/admin/shared/FormField";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { uploadArticleCover } from "@/lib/actions/uploads";
import type { ArticleDetail, Category } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/utils/image-upload";
import { slugify } from "@/lib/utils/slug";
import {
  ArticleFormSchema,
  type ArticleFormValues,
  type ArticleInput,
} from "@/lib/validation/article.schema";
import type { Json } from "@/types/database.types";

type SaveStatus = "draft" | "published";

export function ArticleEditor({
  article,
  categories,
}: {
  article?: ArticleDetail;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = Boolean(article);

  const initialCategory = article?.category_id
    ? (categories.find((c) => c.id === article.category_id)?.name ?? "")
    : "";

  const form = useForm<ArticleFormValues>({
    resolver: standardSchemaResolver(ArticleFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content_html: article?.content_html ?? "",
      cover_image_url: article?.cover_image_url ?? "",
      cover_image_alt: article?.cover_image_alt ?? "",
      category: initialCategory,
      author_name: article?.author_name ?? "",
      seo_title: article?.seo_title ?? "",
      seo_description: article?.seo_description ?? "",
      status: article?.status ?? "draft",
    },
  });
  const { register, formState, setValue, watch, handleSubmit, setError } = form;
  const errors = formState.errors;

  // Tiptap JSON lives outside RHF (its recursive type breaks path inference).
  const contentRef = useRef<Json>(article?.content ?? null);

  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [savingStatus, setSavingStatus] = useState<SaveStatus | null>(null);

  const coverUrl = watch("cover_image_url");
  const excerpt = watch("excerpt") ?? "";

  const titleReg = register("title");
  const slugReg = register("slug");

  /* --- cover upload --- */
  const onCoverPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setCoverUploading(true);
    try {
      const result = await uploadArticleCover(file);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setValue("cover_image_url", result.url, { shouldValidate: true });
    } finally {
      setCoverUploading(false);
    }
  };

  /* --- save --- */
  const submit = (status: SaveStatus) =>
    handleSubmit((values) => {
      setSavingStatus(status);
      startTransition(async () => {
        const payload: ArticleInput = {
          ...values,
          status,
          content: contentRef.current,
        };
        const result = article
          ? await updateArticle(article.id, payload)
          : await createArticle(payload);
        if (!result.success) {
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(
              result.fieldErrors,
            )) {
              setError(field as keyof ArticleFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
          toast.error(result.error);
          setSavingStatus(null);
          return;
        }
        toast.success(
          status === "published" ? "Artikel diterbitkan." : "Draft tersimpan.",
        );
        if (!article) {
          router.replace(`/admin/artikel/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
        setSavingStatus(null);
      });
    });

  const contentError = errors.content_html?.message;

  return (
    <>
      {/* Topbar */}
      <header
        className={cn(
          "sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border px-7 py-3.5",
          "bg-background/92 backdrop-blur-sm",
        )}
      >
        <Link
          href="/admin/artikel"
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-border border-b-[3px] bg-surface px-3 py-2 text-[0.84rem] font-bold text-foreground hover:bg-surface-muted"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          Kembali
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-[0.74rem] uppercase tracking-[0.08em] text-foreground-subtle">
            Artikel / {watch("title") || "Artikel baru"}
          </div>
          <div className="mt-0.5">
            {article ? (
              <ArticleStatusBadge status={article.status} />
            ) : (
              <span className="text-[0.8rem] font-semibold text-foreground-muted">
                Belum disimpan
              </span>
            )}
          </div>
        </div>
        {isEdit && article?.status === "published" ? (
          <ChunkyButton
            asChild
            href={`/artikel/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="sm"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2.2} />
            Lihat
          </ChunkyButton>
        ) : null}
        <ChunkyButton
          variant="secondary"
          size="sm"
          onClick={submit("draft")}
          disabled={pending}
        >
          {pending && savingStatus === "draft" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={2.2} />
          )}
          Simpan Draf
        </ChunkyButton>
        <ChunkyButton
          variant="primary"
          size="sm"
          onClick={submit("published")}
          disabled={pending}
        >
          {pending && savingStatus === "published" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
          ) : (
            <Send className="h-4 w-4" strokeWidth={2.2} />
          )}
          Terbitkan
        </ChunkyButton>
      </header>

      <main className="flex-1 px-7 pb-16 pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Editor pane */}
          <div className="min-w-0 space-y-4">
            <div className="rounded-[18px] border border-border bg-surface p-5">
              <label htmlFor="title" className="sr-only">
                Judul artikel
              </label>
              <textarea
                id="title"
                rows={2}
                placeholder="Tulis judul artikel…"
                aria-invalid={!!errors.title || undefined}
                className={cn(
                  "w-full resize-none border-0 bg-transparent font-heading text-[1.9rem] font-bold leading-[1.15] tracking-[-0.02em]",
                  "text-foreground outline-none placeholder:text-foreground-subtle",
                )}
                {...titleReg}
                onChange={(e) => {
                  void titleReg.onChange(e);
                  if (!slugEdited) {
                    setValue("slug", slugify(e.target.value));
                  }
                }}
              />
              <FieldError id="err-title" message={errors.title?.message} />

              {/* Slug */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-[10px] border border-dashed border-border px-3 py-2 text-[0.84rem]">
                <span className="font-mono text-foreground-subtle">
                  fellaswimming.com/artikel/
                </span>
                <input
                  aria-label="Slug artikel"
                  placeholder="otomatis-dari-judul"
                  aria-invalid={!!errors.slug || undefined}
                  className="min-w-[120px] flex-1 bg-transparent font-mono font-semibold text-primary-dark outline-none placeholder:font-normal placeholder:text-foreground-subtle"
                  {...slugReg}
                  onChange={(e) => {
                    void slugReg.onChange(e);
                    setSlugEdited(true);
                  }}
                />
              </div>
              <FieldError id="err-slug" message={errors.slug?.message} />

              {/* Excerpt */}
              <div className="mt-4">
                <FieldLabel htmlFor="excerpt">Ringkasan</FieldLabel>
                <Textarea
                  id="excerpt"
                  rows={2}
                  className="min-h-[64px]"
                  placeholder="Satu-dua kalimat yang muncul di hasil pencarian dan card artikel."
                  aria-invalid={!!errors.excerpt || undefined}
                  {...register("excerpt")}
                />
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <FieldError id="err-excerpt" message={errors.excerpt?.message} />
                  <span
                    className={cn(
                      "ml-auto shrink-0 font-mono text-[0.76rem]",
                      excerpt.length > 160
                        ? "text-accent-dark"
                        : "text-foreground-subtle",
                    )}
                  >
                    {excerpt.length} / 160 karakter
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div>
              <TiptapEditor
                initialContent={article?.content_html}
                onChange={(content, html) => {
                  contentRef.current = content;
                  setValue("content_html", html, {
                    shouldValidate: formState.isSubmitted,
                  });
                }}
              />
              <FieldError id="err-content" message={contentError} />
            </div>
          </div>

          {/* Meta aside */}
          <aside className="space-y-4">
            {/* Cover */}
            <div className="rounded-[16px] border border-border bg-surface p-4">
              <FieldLabel>Cover artikel</FieldLabel>
              <input
                ref={coverInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={onCoverPick}
              />
              {coverUrl ? (
                <div className="group relative aspect-video overflow-hidden rounded-[12px] border border-border bg-surface-muted">
                  <Image
                    src={coverUrl}
                    alt={watch("cover_image_alt") || "Pratinjau cover"}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={coverUploading}
                      className="inline-flex items-center gap-1 rounded-[8px] bg-surface/90 px-2 py-1 text-[0.74rem] font-bold text-foreground shadow-sm hover:bg-surface"
                    >
                      {coverUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5" strokeWidth={2.2} />
                      )}
                      Ganti
                    </button>
                    <button
                      type="button"
                      aria-label="Hapus cover"
                      onClick={() =>
                        setValue("cover_image_url", "", { shouldValidate: true })
                      }
                      className="inline-flex items-center justify-center rounded-[8px] bg-surface/90 px-2 py-1 text-accent shadow-sm hover:bg-accent-tint"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className={cn(
                    "flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-[12px]",
                    "border border-dashed border-border bg-surface-muted text-foreground-muted",
                    "transition-colors hover:border-primary hover:text-primary-dark",
                    errors.cover_image_url && "border-destructive",
                  )}
                >
                  {coverUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5" strokeWidth={2} />
                  )}
                  <span className="text-[0.82rem] font-semibold">
                    Unggah cover
                  </span>
                  <span className="font-mono text-[0.7rem] text-foreground-subtle">
                    JPG · PNG · WebP · maks 5MB
                  </span>
                </button>
              )}
              <FieldError
                id="err-cover"
                message={errors.cover_image_url?.message}
              />

              <div className="mt-3">
                <FieldLabel htmlFor="cover_image_alt">
                  Deskripsi cover (alt)
                </FieldLabel>
                <TextInput
                  id="cover_image_alt"
                  placeholder="cth: pelatih sedang mengajar anak berenang"
                  aria-invalid={!!errors.cover_image_alt || undefined}
                  {...register("cover_image_alt")}
                />
                <FieldError
                  id="err-cover-alt"
                  message={errors.cover_image_alt?.message}
                />
              </div>
            </div>

            {/* Category + SEO */}
            <div className="space-y-3 rounded-[16px] border border-border bg-surface p-4">
              <div>
                <FieldLabel htmlFor="category" optional>
                  Kategori
                </FieldLabel>
                <TextInput
                  id="category"
                  list="category-options"
                  placeholder="cth: Tips Praktis"
                  {...register("category")}
                />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
                <FieldHint>
                  Ketik nama kategori. Kategori baru dibuat otomatis saat
                  disimpan.
                </FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="seo_title" optional>
                  SEO title
                </FieldLabel>
                <TextInput
                  id="seo_title"
                  placeholder="Bawaan: judul artikel"
                  {...register("seo_title")}
                />
                <FieldError id="err-seo-title" message={errors.seo_title?.message} />
              </div>

              <div>
                <FieldLabel htmlFor="seo_description" optional>
                  SEO description
                </FieldLabel>
                <Textarea
                  id="seo_description"
                  rows={3}
                  placeholder="Bawaan: ringkasan artikel"
                  {...register("seo_description")}
                />
                <FieldError
                  id="err-seo-desc"
                  message={errors.seo_description?.message}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
