DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS balance CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS embeddings CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;

-- create vector extension supabase
CREATE EXTENSION vector with schema extensions;

-- Create balance table
CREATE TABLE IF NOT EXISTS balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credit DECIMAL(15,2) DEFAULT 0.00,
	  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE PaymentStatus AS ENUM ('PENDING', 'FAILED', 'PAID');
CREATE TYPE PaymentMethod AS ENUM ('MIDTRANS');
CREATE TYPE TransactionType AS ENUM ('TOP_UP', 'GRANTED', 'USAGE');

-- Transaction table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) DEFAULT 0.00,
  transaction_type TransactionType DEFAULT 'TOP_UP',
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE payments (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
   invoice_no VARCHAR(50) UNIQUE NOT NULL,
   payment_method PaymentMethod DEFAULT 'MIDTRANS',
   amount DECIMAL(15,2) NOT NULL,
   tax DECIMAL(15,2) NOT NULL,
   payment_url VARCHAR(255),
   payment_status PaymentStatus DEFAULT 'PENDING',
   metadata JSONB,
	 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    system_prompt TEXT,
		user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    content TEXT,
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size INTEGER,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE, 
  	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
  	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    message TEXT NOT NULL,
    response TEXT,
    context_used TEXT,
    metadata JSONB,
	  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Balance
CREATE INDEX IF NOT EXISTS idx_balance_userid ON balance(user_id);

-- payments indexing
CREATE INDEX IF NOT EXISTS idx_payment_userid ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_created ON payments(created_at);


-- transactions indexing
CREATE INDEX IF NOT EXISTS idx_transaction_userid ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transaction_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_pending_expiry ON payments (payment_status, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_user_status_created ON payments(user_id, payment_status, created_at);
CREATE INDEX IF NOT EXISTS idx_transaction_user_type_created ON transactions (user_id, transaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_agent_id ON documents(agent_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_document_id ON embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_agent_id ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_agent_id ON chat_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_role ON chats(role);
CREATE INDEX idx_chats_message_gin ON chats USING gin (to_tsvector('english', message));
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw ON embeddings USING hnsw (embedding vector_cosine_ops);


