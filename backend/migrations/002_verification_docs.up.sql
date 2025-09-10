-- Create table to store user verification documents
CREATE TABLE IF NOT EXISTS user_verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL, -- e.g., 'student_id_front', 'student_id_back', 'selfie'
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_verification_documents_user_id ON user_verification_documents(user_id);


