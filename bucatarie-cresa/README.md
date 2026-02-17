# Aplicație Bucătărie Creșă - Raport Zilnic

Aplicație web pentru bucătăria unei creșe care permite generarea rapoartelor zilnice cu ingredientele folosite și calculul macronutrienților.

## 📋 Caracteristici

- Generarea rapoartelor zilnice cu ingredientele folosite
- Calcul automat al cantităților pe baza numărului de porții
- Calculul macronutrienților per porție pentru fiecare masă
- Gestionarea rețetelor și ingredientelor
- Exportul rapoartelor în format PDF
- Istoric rapoarte (ultimele 7 zile)

## 🛠️ Stack Tehnologic

- **Frontend**: Next.js 14 (App Router) cu TypeScript
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL + REST API)
- **PDF**: @react-pdf/renderer
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 🚀 Setup Inițial

### 1. Instalare Dependențe

```bash
npm install
```

### 2. Configurare Supabase

1. Creează un cont pe [supabase.com](https://supabase.com)
2. Creează un proiect nou
3. În SQL Editor, rulează scriptul din `database-schema.sql`
4. Copiază URL-ul proiectului și cheia anonimă

### 3. Variabile de Mediu

Creează fișierul `.env.local` (folosind `.env.local.example` ca template):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_NUME_CRESA=Nume Creșa
```

### 4. Populare Date Inițiale (Seed)

Datele inițiale pentru ingrediente se află în `data/ingrediente-initiale.json`.
Acestea pot fi importate manual în Supabase Table Editor sau prin scripturi.

## 📁 Structura Proiectului

```
bucatarie-cresa/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Pagina principală (Raport Zilnic)
│   ├── retete/                   # Pagini pentru rețete
│   ├── ingrediente/              # Pagini pentru ingrediente
│   └── istoric/                  # Pagini pentru istoric rapoarte
├── components/                   # Componente React
│   ├── ui/                       # Componente UI reutilizabile
│   ├── layout/                   # Header, Navigation
│   ├── raport/                   # Componente raport zilnic
│   ├── retete/                   # Componente rețete
│   ├── ingrediente/              # Componente ingrediente
│   └── pdf/                      # Template PDF
├── lib/                          # Biblioteci și utilități
│   ├── types.ts                  # TypeScript interfaces
│   ├── supabase.ts               # Client Supabase + CRUD
│   ├── calculations.ts           # Logica de calcul
│   └── utils.ts                  # Funcții utilitare
├── hooks/                        # React hooks custom
├── data/                         # Date seed
│   └── ingrediente-initiale.json # Ingrediente predefinite
└── database-schema.sql           # Schema SQL pentru Supabase
```

## 🗄️ Baza de Date

Schema bazei de date include:

- **ingrediente** - toate ingredientele disponibile
- **retete** - rețetele disponibile organizate pe categorii
- **reteta_ingrediente** - relația many-to-many între rețete și ingrediente
- **rapoarte** - rapoartele zilnice generate

Vezi `database-schema.sql` pentru schema completă.

## 🏃 Rulare Locală

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`

## 📦 Build & Deploy

### Build Local

```bash
npm run build
npm start
```

### Deploy pe Vercel

1. Conectează repository-ul GitHub la Vercel
2. Adaugă variabilele de mediu din `.env.local`
3. Deploy automat la fiecare push

## 📖 Utilizare

### Creare Raport Zilnic

1. Accesează pagina principală
2. Completează data, numele bucătarului și numărul de porții
3. Selectează preparatele pentru fiecare masă
4. Click "Calculează" pentru a vedea rezultatele
5. Click "Generează PDF" pentru a descărca raportul

### Gestionare Rețete

1. Navigare la `/retete`
2. Adaugă rețete noi cu categoria aferentă
3. Editează rețetele pentru a adăuga ingrediente

### Gestionare Ingrediente

1. Navigare la `/ingrediente`
2. Adaugă ingrediente noi cu valorile nutriționale
3. Editează sau șterge ingrediente existente

### Vizualizare Istoric

1. Navigare la `/istoric`
2. Vezi ultimele 7 rapoarte generate
3. Descarcă din nou rapoartele în format PDF

## 🔧 Configurare

### Categorii Mese

- Mic Dejun
- Gustare 1
- Prânz - Ciorbă
- Prânz - Fel Doi
- Gustare 2

### Unități de Măsură

- **Unitate Bază**: g (grame), ml (mililitri), buc (bucăți)
- **Unitate Raport**: Kg, L, Buc

## 📝 Licență

Acest proiect este creat pentru uz intern al creșei.
