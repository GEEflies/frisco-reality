-- Fix "Function Search Path Mutable" lint warnings.
-- Sets search_path = public on all PL/pgSQL functions so they don't
-- inherit the session's search_path (Supabase security best practice).

ALTER FUNCTION public.sluggify(text) SET search_path = public;
ALTER FUNCTION public.generate_listing_slug() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
