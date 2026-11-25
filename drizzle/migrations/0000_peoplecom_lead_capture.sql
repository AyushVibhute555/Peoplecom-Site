CREATE TABLE public.contact_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120), email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254), message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 280), source text NOT NULL DEFAULT 'home');
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.newsletter_subscribers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 254));
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.form_rate_limits (key_hash text PRIMARY KEY, window_start timestamptz NOT NULL, hits integer NOT NULL DEFAULT 1);
GRANT ALL ON public.form_rate_limits TO service_role;
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_form_attempt(p_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n integer;
BEGIN
INSERT INTO public.form_rate_limits AS limits (key_hash, window_start, hits) VALUES (p_key, now(), 1)
ON CONFLICT (key_hash) DO UPDATE SET hits = CASE WHEN limits.window_start < now() - interval '15 minutes' THEN 1 ELSE limits.hits + 1 END, window_start = CASE WHEN limits.window_start < now() - interval '15 minutes' THEN now() ELSE limits.window_start END RETURNING hits INTO n;
RETURN n <= 5;
END; $$;
REVOKE ALL ON FUNCTION public.claim_form_attempt(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_form_attempt(text) TO service_role;