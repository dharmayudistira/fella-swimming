"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, Pencil, Star, Trash2 } from "lucide-react";

import { avatarFor } from "@/components/admin/shared/avatar";
import { Switch } from "@/components/ui/switch";
import type { AdminTestimonial } from "@/lib/queries/testimonials";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/format";

export function SortableRow({
  testimonial,
  order,
  canReorder,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  testimonial: AdminTestimonial;
  order: number;
  canReorder: boolean;
  onEdit: (t: AdminTestimonial) => void;
  onDelete: (t: AdminTestimonial) => void;
  onToggleFeatured: (t: AdminTestimonial) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: testimonial.id, disabled: !canReorder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onEdit(testimonial)}
      className={cn(
        "group cursor-pointer border-b border-border last:border-b-0",
        "transition-colors hover:bg-surface-muted",
        isDragging && "relative z-10 bg-primary-tint shadow-md",
      )}
    >
      {/* Drag handle */}
      <td className="w-9 pl-3 align-middle" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Geser untuk atur urutan"
          {...attributes}
          {...listeners}
          disabled={!canReorder}
          className={cn(
            "inline-flex h-7 w-6 items-center justify-center rounded-[6px] text-foreground-subtle",
            canReorder
              ? "cursor-grab opacity-50 hover:bg-surface hover:opacity-100 active:cursor-grabbing"
              : "cursor-not-allowed opacity-20",
          )}
        >
          <GripVertical className="h-4 w-4" strokeWidth={2} />
        </button>
      </td>

      {/* Order */}
      <td className="w-10 align-middle">
        <span
          className={cn(
            "inline-flex h-6 min-w-6 items-center justify-center rounded-[8px] px-1.5 font-mono text-[0.74rem] font-bold",
            testimonial.featured
              ? "bg-accent text-accent-foreground shadow-[0_2px_0_var(--color-accent-dark)]"
              : "bg-surface-muted text-foreground-muted",
          )}
        >
          {order}
        </span>
      </td>

      {/* Person */}
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full font-heading text-[0.74rem] font-bold text-white">
            {testimonial.photo_url ? (
              <Image
                src={testimonial.photo_url}
                alt={testimonial.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-full w-full items-center justify-center"
                style={{ background: avatarFor(testimonial.id) }}
              >
                {getInitials(testimonial.name)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <div className="truncate font-bold text-foreground">
              {testimonial.name}
            </div>
            {testimonial.role ? (
              <div className="truncate text-[0.76rem] text-foreground-muted">
                {testimonial.role}
              </div>
            ) : null}
          </div>
        </div>
      </td>

      {/* Quote */}
      <td className="max-w-[320px] px-3 py-3 align-middle">
        <p className="line-clamp-2 text-[0.84rem] text-foreground-muted">
          {testimonial.text}
        </p>
      </td>

      {/* Rating */}
      <td className="px-3 py-3 align-middle">
        <div className="flex gap-0.5" aria-label={`${testimonial.rating} dari 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn(
                "h-3.5 w-3.5",
                n <= testimonial.rating
                  ? "fill-sun text-sun"
                  : "fill-transparent text-border",
              )}
              strokeWidth={2}
            />
          ))}
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-3 align-middle">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.72rem] font-bold leading-none",
            testimonial.status === "published"
              ? "bg-success-tint text-success-dark"
              : "bg-sun-tint text-sun-dark",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              testimonial.status === "published" ? "bg-success" : "bg-sun",
            )}
          />
          {testimonial.status === "published" ? "Terbit" : "Draf"}
        </span>
      </td>

      {/* Featured */}
      <td className="px-3 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={testimonial.featured}
          onCheckedChange={() => onToggleFeatured(testimonial)}
          aria-label={
            testimonial.featured
              ? "Sembunyikan dari landing"
              : "Tampilkan di landing"
          }
        />
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-right align-middle" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Edit testimoni"
            title="Edit"
            onClick={() => onEdit(testimonial)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-border border-b-2 bg-surface text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Hapus testimoni"
            title="Hapus"
            onClick={() => onDelete(testimonial)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-border border-b-2 bg-surface text-foreground-muted transition-colors hover:bg-accent-tint hover:text-accent-dark"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </td>
    </tr>
  );
}
