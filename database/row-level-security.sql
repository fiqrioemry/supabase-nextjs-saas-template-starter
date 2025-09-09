-- Enable RLS for all tables
ALTER TABLE balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BALANCE TABLE POLICIES
-- =============================================================================

-- Policy for users to view their own balance
CREATE POLICY "Users can view their own balance" 
ON balance FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to update their own balance (if needed)
CREATE POLICY "Users can update their own balance" 
ON balance FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================================================
-- TRANSACTIONS TABLE POLICIES  
-- =============================================================================

-- Policy for users to view their own transactions
CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- PAYMENTS TABLE POLICIES
-- =============================================================================

-- Policy for users to view their own payments
CREATE POLICY "Users can view their own payments" 
ON payments FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own payments
CREATE POLICY "Users can insert their own payments" 
ON payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own payments (for status updates)
CREATE POLICY "Users can update their own payments" 
ON payments FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================================================
-- AGENTS TABLE POLICIES
-- =============================================================================

-- Policy for users to view their own agents
CREATE POLICY "Users can view their own agents" 
ON agents FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own agents
CREATE POLICY "Users can insert their own agents" 
ON agents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own agents
CREATE POLICY "Users can update their own agents" 
ON agents FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own agents
CREATE POLICY "Users can delete their own agents" 
ON agents FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- DOCUMENTS TABLE POLICIES
-- =============================================================================

-- Policy for users to view their own documents
CREATE POLICY "Users can view their own documents" 
ON documents FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own documents
CREATE POLICY "Users can insert their own documents" 
ON documents FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    agent_id IS NULL 
    OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
  )
);

-- Policy for users to update their own documents
CREATE POLICY "Users can update their own documents" 
ON documents FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own documents
CREATE POLICY "Users can delete their own documents" 
ON documents FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- EMBEDDINGS TABLE POLICIES
-- =============================================================================

-- Policy for users to view embeddings for their documents/agents
CREATE POLICY "Users can view their own embeddings" 
ON embeddings FOR SELECT 
USING (
  document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
  OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);

-- Policy for users to insert embeddings for their documents/agents
CREATE POLICY "Users can insert their own embeddings" 
ON embeddings FOR INSERT 
WITH CHECK (
  (document_id IS NULL OR document_id IN (SELECT id FROM documents WHERE user_id = auth.uid()))
  AND (agent_id IS NULL OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()))
);

-- Policy for users to update their own embeddings
CREATE POLICY "Users can update their own embeddings" 
ON embeddings FOR UPDATE 
USING (
  document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
  OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);

-- Policy for users to delete their own embeddings
CREATE POLICY "Users can delete their own embeddings" 
ON embeddings FOR DELETE 
USING (
  document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
  OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);

-- =============================================================================
-- CHAT_SESSIONS TABLE POLICIES
-- =============================================================================

-- Policy for users to view their own chat sessions
CREATE POLICY "Users can view their own chat sessions" 
ON chat_sessions FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own chat sessions
CREATE POLICY "Users can insert their own chat sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    agent_id IS NULL 
    OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
  )
);

-- Policy for users to update their own chat sessions
CREATE POLICY "Users can update their own chat sessions" 
ON chat_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own chat sessions
CREATE POLICY "Users can delete their own chat sessions" 
ON chat_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- CHATS TABLE POLICIES
-- =============================================================================

-- Policy for users to view chats from their own sessions
CREATE POLICY "Users can view their own chats" 
ON chats FOR SELECT 
USING (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
);

-- Policy for users to insert chats into their own sessions
CREATE POLICY "Users can insert their own chats" 
ON chats FOR INSERT 
WITH CHECK (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
);

-- Policy for users to update their own chats
CREATE POLICY "Users can update their own chats" 
ON chats FOR UPDATE 
USING (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
);

-- Policy for users to delete their own chats
CREATE POLICY "Users can delete their own chats" 
ON chats FOR DELETE 
USING (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
);


-- =============================================================================
-- GRANT PERMISSIONS FOR AUTHENTICATED USERS
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON balance TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON agents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON embeddings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chats TO authenticated;

GRANT EXECUTE ON FUNCTION check_email_exist(text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_account() TO authenticated;
