"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ActionError } from "@/lib/actions/errors";
import { updateRegistrationStatus } from "@/lib/actions/registration";
import type { Registration } from "@/lib/queries/registrations";
import type { UpdateRegistrationStatusInput } from "@/lib/validation/registration-admin.schema";

import {
  REGISTRATIONS_LIST_KEY,
  REGISTRATION_DETAIL_KEY,
} from "./pendaftaranKeys";

export type PendaftaranListSnapshot = {
  items: Registration[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * Wraps `updateRegistrationStatus` with optimistic update + rollback so the
 * admin pendaftaran modal can save without making the user wait on the
 * server round-trip. Touches every cached registrations list query and the
 * single-detail cache.
 */
export function usePendaftaranMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: UpdateRegistrationStatusInput,
    ): Promise<Registration> => {
      const result = await updateRegistrationStatus(input);
      if (!result.success) {
        throw new ActionError(result.error, result.code);
      }
      return result.data;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: REGISTRATIONS_LIST_KEY });
      await queryClient.cancelQueries({
        queryKey: REGISTRATION_DETAIL_KEY(input.id),
      });

      const previousLists = queryClient.getQueriesData<PendaftaranListSnapshot>(
        { queryKey: REGISTRATIONS_LIST_KEY },
      );
      const previousDetail = queryClient.getQueryData<Registration>(
        REGISTRATION_DETAIL_KEY(input.id),
      );

      const now = new Date().toISOString();
      const patch = (row: Registration): Registration => {
        if (row.id !== input.id) return row;
        return {
          ...row,
          status: input.status,
          internal_notes:
            input.internal_notes !== undefined
              ? input.internal_notes || null
              : row.internal_notes,
          contacted_at:
            input.status === "dihubungi" && !row.contacted_at
              ? now
              : row.contacted_at,
        };
      };

      queryClient.setQueriesData<PendaftaranListSnapshot>(
        { queryKey: REGISTRATIONS_LIST_KEY },
        (old) =>
          old
            ? { ...old, items: old.items.map(patch) }
            : old,
      );
      if (previousDetail) {
        queryClient.setQueryData<Registration>(
          REGISTRATION_DETAIL_KEY(input.id),
          patch(previousDetail),
        );
      }

      return { previousLists, previousDetail };
    },
    onError: (_err, _input, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(
          REGISTRATION_DETAIL_KEY(context.previousDetail.id),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: REGISTRATIONS_LIST_KEY });
      queryClient.invalidateQueries({
        queryKey: REGISTRATION_DETAIL_KEY(input.id),
      });
    },
  });
}
