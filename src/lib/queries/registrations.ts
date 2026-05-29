import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { Database, RegistrationStatus } from "@/types/database.types";

export type Registration = Database["public"]["Tables"]["registrations"]["Row"];

export type RegistrationListItem = Pick<
  Registration,
  | "id"
  | "display_id"
  | "student_name"
  | "student_age"
  | "parent_name"
  | "parent_whatsapp"
  | "preferred_class_type"
  | "preferred_schedule"
  | "status"
  | "contacted_at"
  | "created_at"
>;

const LIST_COLUMNS =
  "id, display_id, student_name, student_age, parent_name, parent_whatsapp, preferred_class_type, preferred_schedule, status, contacted_at, created_at";

export type OverviewStats = {
  thisMonth: number;
  newToday: number;
  pendingFollowUp: number;
};

/**
 * Counts the home dashboard needs in one round-trip.
 *
 * - `thisMonth`: all registrations created at-or-after the 1st of the current
 *   month (local server time).
 * - `newToday`: registrations created at-or-after midnight today (server TZ).
 * - `pendingFollowUp`: status in (baru, dihubungi) — needs attention.
 */
export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = await createServerClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();

  const [monthRes, todayRes, pendingRes] = await Promise.all([
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth),
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfToday),
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .in("status", ["baru", "dihubungi"]),
  ]);

  return {
    thisMonth: monthRes.count ?? 0,
    newToday: todayRes.count ?? 0,
    pendingFollowUp: pendingRes.count ?? 0,
  };
}

/**
 * Most-recent N registrations for the home dashboard "Pendaftaran terbaru"
 * table. Default 5, as called out in FR-014.
 */
export async function getRecentLeads(
  limit = 5,
): Promise<RegistrationListItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[registrations] getRecentLeads failed", error);
    return [];
  }
  return data ?? [];
}

export type GetRegistrationsListParams = {
  status?: RegistrationStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type GetRegistrationsListResult = {
  items: RegistrationListItem[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * Paginated/filterable list for /admin/pendaftaran (FR-015).
 *
 * `search` matches student_name, parent_name, or parent_whatsapp (ilike).
 * Phone search ignores common separators — we strip spaces/dashes/plus from
 * the search term before the `ilike`.
 */
export async function getRegistrationsList({
  status = "all",
  search,
  page = 1,
  pageSize = 50,
}: GetRegistrationsListParams = {}): Promise<GetRegistrationsListResult> {
  const supabase = await createServerClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("registrations")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search && search.trim()) {
    const term = search.trim().replace(/,/g, "");
    const digitsOnly = term.replace(/[\s\-+().]/g, "");
    // WA numbers stored as 62-prefixed digits. Normalize leading "0" → "62"
    // so "0812..." finds "62812..." in the DB.
    let phoneTerm = term;
    if (/^\d+$/.test(digitsOnly)) {
      phoneTerm = digitsOnly.startsWith("0")
        ? `62${digitsOnly.slice(1)}`
        : digitsOnly;
    }
    const like = (val: string) =>
      `%${val.replace(/[%_\\]/g, "\\$&")}%`;
    query = query.or(
      `student_name.ilike.${like(term)},parent_name.ilike.${like(term)},parent_whatsapp.ilike.${like(phoneTerm)}`,
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("[registrations] getRegistrationsList failed", error);
    return { items: [], total: 0, page: safePage, pageSize };
  }
  return {
    items: data ?? [],
    total: count ?? 0,
    page: safePage,
    pageSize,
  };
}

/**
 * Single registration by id — used by the pendaftaran modal to hydrate the
 * full read-only detail (notes, internal_notes, contacted_at).
 */
export async function getRegistrationById(
  id: string,
): Promise<Registration | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[registrations] getRegistrationById failed", error);
    return null;
  }
  return data;
}
