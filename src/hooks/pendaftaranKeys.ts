/**
 * Stable TanStack Query keys for the admin pendaftaran surface. Use these
 * everywhere instead of inlining strings so optimistic updates and
 * invalidations stay consistent.
 */

import type { RegistrationStatus } from "@/types/database.types";

export const REGISTRATIONS_LIST_KEY = ["admin", "registrations", "list"] as const;

export type RegistrationsListFilters = {
  status: RegistrationStatus | "all";
  search: string;
  page: number;
  pageSize: number;
};

export const registrationsListKey = (filters: RegistrationsListFilters) =>
  [...REGISTRATIONS_LIST_KEY, filters] as const;

export const REGISTRATION_DETAIL_KEY = (id: string) =>
  ["admin", "registrations", "detail", id] as const;
