
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can manage their own forms" ON forms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own form fields" ON form_fields
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM forms WHERE forms.id = form_fields.form_id));

CREATE POLICY "Anyone can submit responses" ON form_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view responses for their own forms" ON form_responses
  FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM forms WHERE forms.id = form_responses.form_id));
