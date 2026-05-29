import { AdminTopbar } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Shared admin loading skeletons (TASK-076). Used by route-level `loading.tsx`
 * boundaries (visible during the server data fetch) and by the client tables
 * while a query loads with no cached/initial data.
 */

/** Skeleton `<tr>` rows for an admin table body. */
export function TableSkeletonRows({
  rows = 6,
  columns,
}: {
  rows?: number;
  columns: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border last:border-b-0">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <Skeleton
                className={cn(
                  "h-4",
                  c === 0 ? "w-16" : c % 3 === 0 ? "w-14" : "w-28",
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Full-page skeleton for an admin list route (topbar + filters + table). */
export function AdminListSkeleton({
  title,
  columns,
}: {
  title: string;
  columns: number;
}) {
  return (
    <>
      <AdminTopbar title={title} />
      <main className="flex-1 px-7 pb-12 pt-6">
        <Skeleton className="mb-4 h-11 w-72 max-w-full rounded-[14px]" />
        <Skeleton className="mb-4 h-11 w-full max-w-md rounded-[12px]" />
        <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
          <table className="w-full border-collapse text-[0.88rem]">
            <tbody>
              <TableSkeletonRows rows={6} columns={columns} />
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}

/** Single stat-card skeleton matching StatCard's shape. */
export function StatCardSkeleton() {
  return (
    <div className="rounded-[16px] border border-border border-b-[4px] bg-surface p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 rounded-[11px]" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-14" />
      <Skeleton className="mt-2 h-3 w-40" />
    </div>
  );
}

/** Full-page skeleton for the admin home dashboard. */
export function AdminHomeSkeleton() {
  return (
    <>
      <AdminTopbar title="Dashboard" />
      <main className="flex-1 px-7 pb-12 pt-6">
        <Skeleton className="h-28 w-full rounded-[18px]" />
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>
        <section className="mt-8 overflow-hidden rounded-[16px] border border-border bg-surface">
          <table className="w-full border-collapse text-[0.88rem]">
            <tbody>
              <TableSkeletonRows rows={5} columns={6} />
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
