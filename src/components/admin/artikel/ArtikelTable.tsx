"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ArticleStatusBadge } from "@/components/admin/artikel/ArticleStatusBadge";
import { TableSkeletonRows } from "@/components/admin/shared/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { articlesListKey } from "@/hooks/articleKeys";
import {
  useDeleteArticle,
  usePublishToggle,
} from "@/hooks/useArticleMutations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAdminArticlesList } from "@/lib/actions/articles";
import type {
  AdminArticleListItem,
  ArticleStatus,
  Category,
  GetAdminArticlesResult,
} from "@/lib/queries/articles";
import { cn } from "@/lib/utils";
import { formatRelativeID } from "@/lib/utils/format";

type StatusFilter = ArticleStatus | "all";

const TABS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const PAGE_SIZE = 10;

export function ArtikelTable({
  initialData,
  categories,
}: {
  initialData: GetAdminArticlesResult;
  categories: Category[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 300);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminArticleListItem | null>(
    null,
  );

  const publishToggle = usePublishToggle();
  const deleteArticle = useDeleteArticle();

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string | null) => (id ? (map.get(id) ?? null) : null);
  }, [categories]);

  const filters = { status, search, page, pageSize: PAGE_SIZE };
  const isInitialState = status === "all" && search === "" && page === 1;

  const query = useQuery({
    queryKey: articlesListKey(filters),
    queryFn: async (): Promise<GetAdminArticlesResult> => {
      const result = await getAdminArticlesList({
        status,
        search,
        page,
        pageSize: PAGE_SIZE,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    initialData: isInitialState ? initialData : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const handlePublishToggle = (article: AdminArticleListItem) => {
    const publish = article.status !== "published";
    publishToggle.mutate(
      { id: article.id, publish },
      {
        onError: (err) =>
          toast.error(
            err instanceof Error ? err.message : "Gagal mengubah status.",
          ),
      },
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    deleteArticle.mutate(target.id, {
      onSuccess: () => toast.success("Artikel dihapus."),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menghapus artikel.",
        ),
    });
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter status artikel"
        className="mb-4 flex flex-wrap gap-1 rounded-[14px] border border-border bg-surface-muted p-1"
      >
        {TABS.map((tab) => {
          const active = tab.value === status;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[0.86rem] font-bold transition-colors",
                active
                  ? "bg-surface text-foreground shadow-[0_2px_0_var(--color-border),0_1px_2px_rgba(26,35,50,0.04)]"
                  : "text-foreground-muted hover:bg-surface/60 hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[12px] border border-border border-b-[3px] bg-surface px-3.5 py-2.5 focus-within:border-primary focus-within:border-b-primary">
          <Search className="h-4 w-4 shrink-0 text-foreground-subtle" strokeWidth={2} />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berdasarkan judul artikel..."
            aria-label="Cari artikel"
            className="w-full bg-transparent text-[0.92rem] text-foreground outline-none placeholder:text-foreground-subtle"
          />
        </label>
        {query.isFetching ? (
          <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-foreground-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Memuat&hellip;
          </span>
        ) : null}
      </div>

      <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.88rem]">
            <thead>
              <tr>
                <Th>Artikel</Th>
                <Th>Kategori</Th>
                <Th>Status</Th>
                <Th>Terbit</Th>
                <Th>Diubah</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <TableSkeletonRows columns={6} />
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[0.92rem] text-foreground-muted"
                  >
                    {search || status !== "all"
                      ? "Tidak ada artikel dengan filter ini."
                      : "Belum ada artikel. Mulai dengan tombol “Artikel Baru”."}
                  </td>
                </tr>
              ) : (
                items.map((article) => {
                  const isPublished = article.status === "published";
                  const category = categoryName(article.category_id);
                  return (
                    <tr
                      key={article.id}
                      tabIndex={0}
                      role="button"
                      aria-label={`Edit artikel ${article.title}`}
                      onClick={() =>
                        router.push(`/admin/artikel/${article.id}/edit`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/admin/artikel/${article.id}/edit`);
                        }
                      }}
                      className={cn(
                        "cursor-pointer border-b border-border last:border-b-0",
                        "transition-colors hover:bg-surface-muted",
                        "focus-visible:bg-primary-tint focus-visible:outline-none",
                      )}
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-[8px] border border-border bg-surface-muted">
                            {article.cover_image_url ? (
                              <Image
                                src={article.cover_image_url}
                                alt={article.cover_image_alt}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : null}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-bold text-foreground">
                              {article.title}
                            </div>
                            <div className="truncate font-mono text-[0.74rem] text-foreground-subtle">
                              /artikel/{article.slug}
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        {category ? (
                          <span className="inline-flex items-center rounded-full bg-secondary-soft px-2.5 py-1 text-[0.74rem] font-bold text-secondary-dark">
                            {category}
                          </span>
                        ) : (
                          <span className="text-foreground-subtle">—</span>
                        )}
                      </Td>
                      <Td>
                        <ArticleStatusBadge status={article.status} />
                      </Td>
                      <Td>
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex"
                        >
                          <Switch
                            checked={isPublished}
                            onCheckedChange={() => handlePublishToggle(article)}
                            aria-label={
                              isPublished
                                ? "Sembunyikan artikel"
                                : "Terbitkan artikel"
                            }
                          />
                        </span>
                      </Td>
                      <Td className="whitespace-nowrap font-mono text-[0.8rem] text-foreground-muted">
                        {formatRelativeID(article.updated_at)}
                      </Td>
                      <Td className="text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isPublished ? (
                            <RowAction
                              asLink
                              href={`/artikel/${article.slug}`}
                              label="Lihat di publik"
                            >
                              <ExternalLink className="h-4 w-4" strokeWidth={2} />
                            </RowAction>
                          ) : null}
                          <RowAction
                            asLink
                            href={`/admin/artikel/${article.id}/edit`}
                            label="Edit artikel"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                          </RowAction>
                          <RowAction
                            label="Hapus artikel"
                            danger
                            onClick={() => setDeleteTarget(article)}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </RowAction>
                        </div>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-5 py-3">
            <div className="text-[0.86rem] text-foreground-muted">
              Menampilkan{" "}
              <strong className="font-bold text-foreground">
                {from}–{to}
              </strong>{" "}
              dari <strong className="font-bold text-foreground">{total}</strong>{" "}
              artikel
            </div>
            <div className="flex items-center gap-1">
              <PagerBtn
                ariaLabel="Sebelumnya"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              </PagerBtn>
              <span className="px-2 font-mono text-[0.84rem] font-semibold text-foreground">
                {page} / {totalPages}
              </span>
              <PagerBtn
                ariaLabel="Berikutnya"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </PagerBtn>
            </div>
          </div>
        ) : null}
      </section>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; akan dihapus permanen. Tindakan
              ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-border bg-surface-muted px-4 py-3 text-left",
        "font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 align-middle text-foreground", className)}>
      {children}
    </td>
  );
}

function RowAction({
  children,
  label,
  danger,
  asLink,
  href,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className = cn(
    "inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-border border-b-2 bg-surface text-foreground-muted transition-colors",
    danger
      ? "hover:bg-accent-tint hover:text-accent-dark"
      : "hover:bg-surface-muted hover:text-foreground",
  );
  if (asLink && href) {
    const external = href.startsWith("/artikel/");
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function PagerBtn({
  children,
  ariaLabel,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-[34px] items-center justify-center rounded-[9px] px-2",
        "border border-border border-b-2 bg-surface font-mono text-[0.84rem] font-semibold text-foreground",
        "hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
