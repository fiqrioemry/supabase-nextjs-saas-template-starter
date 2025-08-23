CREATE OR REPLACE FUNCTION check_user_signup_method(email_to_check text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  provider_list text[];
  result json;
BEGIN
  -- Get user info with providers
  SELECT 
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    array_agg(i.provider) as providers
  INTO user_record
  FROM auth.users u
  LEFT JOIN auth.identities i ON u.id = i.user_id
  WHERE u.email = email_to_check
  GROUP BY u.id, u.email, u.email_confirmed_at;
  
  IF user_record.id IS NULL THEN
    -- User doesn't exist
    result := json_build_object(
      'exists', false,
      'providers', '[]'::json,
      'email_confirmed', false
    );
  ELSE
    -- User exists
    result := json_build_object(
      'exists', true,
      'providers', to_json(user_record.providers),
      'email_confirmed', user_record.email_confirmed
    );
  END IF;
  
  RETURN result;
END;
$$; 


CREATE OR REPLACE FUNCTION delete_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Pastikan user sudah login
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;
  
  -- Hapus user (cascade kalau ada FK constraints)
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN json_build_object('success', true, 'message', 'Account deleted successfully');
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('error', SQLERRM);
END;
$$;
