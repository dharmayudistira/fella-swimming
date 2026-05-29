"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { testimonialsListKey } from "@/hooks/testimonialKeys";
import {
  useDeleteTestimonial,
  useReorderTestimonials,
  useToggleFeatured,
} from "@/hooks/useTestimonialMutations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAdminTestimonialsList } from "@/lib/actions/testimonials";
import type {
  AdminTestimonial,
  TestimonialStatus,
} from "@/lib/queries/testimonials";
import { cn } from "@/lib/utils";

import { SortableRow } from "./SortableRow";
import { TestimoniModal } from "./TestimoniModal";

type Tab = "semua" | "featured" | "published" | "draft";

const TAB_FILTER: Record<
  Tab,
  { status: TestimonialStatus | "all"; featured: boolean | "all" }
> = {
  semua: { status: "all", featured: "all" },
  featured: { status: "all", featured: true },
  published: { status: "published", featured: "all" },
  draft: { status: "draft", featured: "all" },
};

const TABS: ReadonlyArray<{ value: Tab; label: string }> = [
  { value: "semua", label: "Semua" },
  { value: "featured", label: "Unggulan" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

export function TestimoniTable({
  initialData,
}: {
  initialData: AdminTestimonial[];
}) {
  const [tab, setTab] = useState<Tab>("semua");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTestimonial | null>(
    null,
  );

  const reorder = useReorderTestimonials();
  const toggleFeatured = useToggleFeatured();
  const deleteTestimonial = useDeleteTestimonial();

  const { status, featured } = TAB_FILTER[tab];
  const filters = { status, featured, search };
  const isInitialState = tab === "semua" && search === "";
  const canReorder = tab === "semua" && search === "";

  const query = useQuery({
    queryKey: testimonialsListKey(filters),
    queryFn: async (): Promise<AdminTestimonial[]> => {
      const result = await getAdminTestimonialsList({
        status,
        featured: featured === "all" ? undefined : featured,
        search,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    initialData: isInitialState ? initialData : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const items = query.data ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = items.map((t) => t.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const newIds = arrayMove(ids, oldIndex, newIndex);
    reorder.mutate(newIds, {
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menyimpan urutan.",
        ),
    });
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (t: AdminTestimonial) => {
    setEditing(t);
    setModalOpen(true);
  };
  const requestDelete = (t: AdminTestimonial) => {
    setModalOpen(false);
    setDeleteTarget(t);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    deleteTestimonial.mutate(target.id, {
      onSuccess: () => toast.success("Testimoni dihapus."),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menghapus testimoni.",
        ),
    });
  };
  const handleToggleFeatured = (t: AdminTestimonial) => {
    toggleFeatured.mutate(t.id, {
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal mengubah status unggulan.",
        ),
    });
  };

  return (
    <>
      <div className="mb-3 flex items-start gap-2.5 rounded-[14px] border border-secondary/40 bg-secondary-tint px-4 py-3 text-[0.86rem] text-foreground">
        <span aria-hidden className="mt-0.5 text-secondary-dark">
          ↕
        </span>
        <p>
          <strong className="font-bold text-secondary-dark">Tips:</strong>{" "}
          Geser baris untuk atur urutan testimoni di landing. Hanya yang
          Unggulan aktif &amp; Terbit yang tampil ke pengunjung.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Filter testimoni"
          className="flex flex-wrap gap-1 rounded-[14px] border border-border bg-surface-muted p-1"
        >
          {TABS.map((t) => {
            const active = t.value === tab;
            return (
              <button
                key={t.value}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[0.86rem] font-bold transition-colors",
                  active
                    ? "bg-surface text-foreground shadow-[0_2px_0_var(--color-border),0_1px_2px_rgba(26,35,50,0.04)]"
                    : "text-foreground-muted hover:bg-surface/60 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <ChunkyButton variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          Tambah Testimoni
        </ChunkyButton>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[12px] border border-border border-b-[3px] bg-surface px-3.5 py-2.5 focus-within:border-primary focus-within:border-b-primary">
          <Search className="h-4 w-4 shrink-0 text-foreground-subtle" strokeWidth={2} />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama orang tua, konteks, atau isi testimoni..."
            aria-label="Cari testimoni"
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

      <DndContext
        id="testimoni-sortable"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.88rem]">
              <thead>
                <tr>
                  <Th className="w-9" />
                  <Th className="w-10">#</Th>
                  <Th>Orang Tua</Th>
                  <Th>Testimoni</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <Th>Unggulan</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-[0.92rem] text-foreground-muted"
                    >
                      {search || tab !== "semua"
                        ? "Tidak ada testimoni dengan filter ini."
                        : "Belum ada testimoni. Tambah satu untuk muncul di landing."}
                    </td>
                  </tr>
                ) : (
                  <SortableContext
                    items={items.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((t, i) => (
                      <SortableRow
                        key={t.id}
                        testimonial={t}
                        order={i + 1}
                        canReorder={canReorder}
                        onEdit={openEdit}
                        onDelete={requestDelete}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </SortableContext>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </DndContext>

      <TestimoniModal
        testimonial={editing}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onRequestDelete={requestDelete}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus testimoni ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Testimoni dari &ldquo;{deleteTarget?.name}&rdquo; akan dihapus
              permanen. Tindakan ini tidak bisa dibatalkan.
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
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-border bg-surface-muted px-3 py-3 text-left",
        "font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}
