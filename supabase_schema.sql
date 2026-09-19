-- Tabla para Categorías (Conceptos de ingreso/egreso)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) para categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories" 
ON public.categories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" 
ON public.categories FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- Tabla para Quincenas
CREATE TABLE public.quincenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quincenas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quincenas" 
ON public.quincenas FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quincenas" 
ON public.quincenas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quincenas" 
ON public.quincenas FOR UPDATE 
USING (auth.uid() = user_id);


-- Tabla para Movimientos (movements)
CREATE TABLE public.movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quincena_id UUID REFERENCES public.quincenas(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their movements" 
ON public.movements FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.quincenas q
        WHERE q.id = movements.quincena_id AND q.user_id = auth.uid()
    )
);
