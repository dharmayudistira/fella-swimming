-- =====================================================
-- 0004_security_hardening.sql
-- Pre-launch security hardening (TASK-081), addressing Supabase advisor
-- WARN-level findings. No behavior change for the app.
--
-- 1. Pin search_path on the trigger functions (lint 0011). Both are plain
--    (not SECURITY DEFINER) so risk is low, but an empty search_path is the
--    recommended posture; in-schema relations (the sequences) are therefore
--    fully qualified. pg_catalog builtins (now, to_char, lpad) resolve
--    implicitly and need no qualification.
-- 2. Drop the redundant `anon can insert registrations` policy (lint 0024).
--    The public form submits via the service-role Server Action
--    (submitRegistration -> createAdminClient), which bypasses RLS, so this
--    anon INSERT policy is unused by the app. Removing it closes a direct
--    PostgREST insert path that would bypass the action's Zod validation and
--    WA-number normalization (spam/abuse surface).
-- =====================================================

-- ----- 1. Pin function search_path ---------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_display_id()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  prefix text;
  year_part text;
  seq_val int;
begin
  year_part := to_char(now(), 'YYYY');
  case new.preferred_class_type
    when 'privat' then
      prefix := 'PRIV';
      seq_val := nextval('public.reg_seq_priv');
    when 'semi_privat' then
      prefix := 'SEMI';
      seq_val := nextval('public.reg_seq_semi');
    when 'grup' then
      prefix := 'GRUP';
      seq_val := nextval('public.reg_seq_grup');
    else
      prefix := 'REG';
      seq_val := nextval('public.reg_seq_reg');
  end case;
  new.display_id := prefix || '-' || year_part || '-' || lpad(seq_val::text, 4, '0');
  return new;
end;
$$;

-- ----- 2. Drop redundant anon-insert policy on registrations -------------
-- The form path uses the service-role client; anon never inserts directly.

drop policy if exists "anon can insert registrations" on public.registrations;
