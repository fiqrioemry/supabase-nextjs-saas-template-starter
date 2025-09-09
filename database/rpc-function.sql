
-- Function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW. updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_balance_updated_at
  BEFORE UPDATE ON balance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payment_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transaction_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  

DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_welcome_credit();

SELECT 
  table_name, 
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND (
    table_name ILIKE '%balance%' 
    OR table_name ILIKE '%token%' 
    OR table_name ILIKE '%transaction%'
  )
ORDER BY table_name;


CREATE OR REPLACE FUNCTION handle_welcome_credit()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  BEGIN
    -- 1. Insert ke tabel Balance dengan credit = 10000
    INSERT INTO public.balance (user_id, credit)
    VALUES (NEW.id, 10000.00);
    
    RAISE LOG 'Balance created for user: %', NEW.id;
    
    -- 2. Insert to tabel Transaction for welcome credit
    INSERT INTO public.transactions (
      user_id,
      amount,
      transaction_type,
      description
    )
    VALUES (
      NEW.id,
      10000.00,
      'GRANTED'::public.TransactionType,
      'Welcoming credit granted upon registration'
    );
    
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NEW;
  END;

  RETURN NEW;
  
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_welcome_credit();


-- delete account
CREATE OR REPLACE FUNCTION delete_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;
  
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN json_build_object('success', true, 'message', 'Account deleted successfully');
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('error', SQLERRM);
END;
$$;


-- check email if exist for signup
CREATE OR REPLACE FUNCTION check_email_exist(email_to_check text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  provider_list text[];
  result json;
BEGIN
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


CREATE OR REPLACE FUNCTION update_expired_payment()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE payments
    SET payment_status = 'FAILED'::PaymentStatus,
        updated_at = NOW()
    WHERE payment_status = 'PENDING'::PaymentStatus
      AND created_at + INTERVAL '24 hour' <= NOW()
      AND created_at IS NOT NULL;
END;
$$;
