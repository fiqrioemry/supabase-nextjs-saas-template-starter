
-- ======================
-- 2. FORMS
-- ======================
create table forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index idx_forms_user_id on forms(user_id);

-- ======================
-- 3. FORM FIELDS
-- ======================
create table form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references forms(id) on delete cascade,
  name text not null,
  label text not null,
  type text not null, -- text, number, date, select, checkbox, radio
  options jsonb,      -- simpan opsi kalau select/checkbox/radio
  position int,
  required boolean default false,
  created_at timestamptz default now()
);

create index idx_form_fields_form_id on form_fields(form_id);

-- ======================
-- 4. FORM RESPONSES
-- ======================
create table form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references forms(id) on delete cascade,
  responder_id uuid references auth.users(id), -- optional, kalau user login submit
  data jsonb not null, -- {"fullname":"Ahmad","skills":["go","react"]}
  created_at timestamptz default now()
);

create index idx_form_responses_form_id on form_responses(form_id);
create index idx_form_responses_jsonb on form_responses using gin (data);
