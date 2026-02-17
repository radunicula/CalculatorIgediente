-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Kitchen Nursery Application
-- ============================================

-- ============================================
-- TABEL: ingrediente
-- Descriere: Stochează toate ingredientele disponibile
-- ============================================
CREATE TABLE ingrediente (
    id SERIAL PRIMARY KEY,
    denumire VARCHAR(255) NOT NULL UNIQUE,

    -- Unitatea în care se măsoară în rețete (g, ml, buc)
    unitate_baza VARCHAR(10) NOT NULL CHECK (unitate_baza IN ('g', 'ml', 'buc')),

    -- Câte unități de bază conține un ambalaj
    -- Ex: 360 (grame per borcan), 1000 (ml per litru), 1 (pentru ouă)
    cantitate_ambalaj DECIMAL(10,2) NOT NULL,

    -- Cum apare în raportul final (Buc, L, Kg)
    unitate_raport VARCHAR(10) NOT NULL CHECK (unitate_raport IN ('Buc', 'L', 'Kg')),

    -- Macronutrienți per 100 unități de bază (100g sau 100ml)
    -- Pentru 'buc' (ex: ouă), valorile sunt per 1 bucată
    calorii_per_100 DECIMAL(10,2) NOT NULL DEFAULT 0,
    proteine DECIMAL(10,2) NOT NULL DEFAULT 0,
    glucide DECIMAL(10,2) NOT NULL DEFAULT 0,
    grasimi DECIMAL(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: retete
-- Descriere: Stochează rețetele disponibile
-- ============================================
CREATE TABLE retete (
    id SERIAL PRIMARY KEY,
    denumire VARCHAR(255) NOT NULL,

    -- Categoria mesei
    categorie VARCHAR(20) NOT NULL CHECK (
        categorie IN ('mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2')
    ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: reteta_ingrediente
-- Descriere: Relația many-to-many între rețete și ingrediente
-- ============================================
CREATE TABLE reteta_ingrediente (
    id SERIAL PRIMARY KEY,
    reteta_id INTEGER NOT NULL REFERENCES retete(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingrediente(id) ON DELETE RESTRICT,

    -- Cantitatea de ingredient necesară pentru O SINGURĂ PORȚIE
    -- Exprimată în unitate_baza a ingredientului (g, ml, sau buc)
    cantitate_per_portie DECIMAL(10,3) NOT NULL,

    UNIQUE(reteta_id, ingredient_id)
);

-- ============================================
-- TABEL: rapoarte
-- Descriere: Stochează rapoartele zilnice generate
-- ============================================
CREATE TABLE rapoarte (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    nume_bucatar VARCHAR(255) NOT NULL,
    nr_portii INTEGER NOT NULL CHECK (nr_portii > 0),

    -- Referințe către rețetele selectate pentru fiecare masă
    mic_dejun_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    gustare1_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    ciorba_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    fel_doi_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    gustare2_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Un singur raport per zi
    UNIQUE(data)
);

-- ============================================
-- INDEXURI pentru performanță
-- ============================================
CREATE INDEX idx_retete_categorie ON retete(categorie);
CREATE INDEX idx_rapoarte_data ON rapoarte(data);
CREATE INDEX idx_reteta_ingrediente_reteta ON reteta_ingrediente(reteta_id);

-- ============================================
-- FUNCȚIE: Ștergere automată rapoarte vechi (> 7 zile)
-- ============================================
CREATE OR REPLACE FUNCTION delete_old_rapoarte()
RETURNS void AS $$
BEGIN
    DELETE FROM rapoarte WHERE data < CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Actualizare updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ingrediente_updated
    BEFORE UPDATE ON ingrediente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_retete_updated
    BEFORE UPDATE ON retete
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Dezactivăm RLS pentru acces public (fără autentificare)
-- ============================================
ALTER TABLE ingrediente ENABLE ROW LEVEL SECURITY;
ALTER TABLE retete ENABLE ROW LEVEL SECURITY;
ALTER TABLE reteta_ingrediente ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapoarte ENABLE ROW LEVEL SECURITY;

-- Politici pentru acces public complet
CREATE POLICY "Allow all access to ingrediente" ON ingrediente FOR ALL USING (true);
CREATE POLICY "Allow all access to retete" ON retete FOR ALL USING (true);
CREATE POLICY "Allow all access to reteta_ingrediente" ON reteta_ingrediente FOR ALL USING (true);
CREATE POLICY "Allow all access to rapoarte" ON rapoarte FOR ALL USING (true);
