-- aktifkan RLS
alter table forms enable row level security;
alter table form_fields enable row level security;
alter table form_responses enable row level security;
alter table payments enable row level security;

create policy "Users can manage their own forms"
  on forms
  for all
  using (auth.uid() = user_id);

create policy "Users can manage their own form fields"
  on form_fields
  for all
  using (auth.uid() in (select user_id from forms where forms.id = form_fields.form_id));

create policy "Anyone can submit responses"
  on form_responses
  for insert
  with check (true);

create policy "Users can view responses for their own forms"
  on form_responses
  for select
  using (auth.uid() in (select user_id from forms where forms.id = form_responses.form_id));
