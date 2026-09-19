-- Tabla para guardar los datos de las Quincenas en el Dashboard
CREATE TABLE public.dashboard_quincenas (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date_text TEXT NOT NULL,
    movements JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) para dashboard_quincenas
ALTER TABLE public.dashboard_quincenas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dashboard quincenas" 
ON public.dashboard_quincenas FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard quincenas" 
ON public.dashboard_quincenas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard quincenas" 
ON public.dashboard_quincenas FOR UPDATE 
USING (auth.uid() = user_id);
