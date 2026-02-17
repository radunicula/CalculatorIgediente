# 🚀 Ghid Complet de Implementare și Deployment

Acest ghid te va ajuta să implementezi și să deploiezi aplicația Bucătărie Creșă pas cu pas.

## 📋 Cuprins

1. [Pregătirea Mediului](#1-pregătirea-mediului)
2. [Setup Supabase](#2-setup-supabase)
3. [Configurare Locală](#3-configurare-locală)
4. [Populare Date Inițiale](#4-populare-date-inițiale)
5. [Testare Locală](#5-testare-locală)
6. [Deploy Vercel](#6-deploy-vercel)
7. [Testare în Producție](#7-testare-în-producție)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Pregătirea Mediului

### Cerințe Minime

- Node.js 18.x sau mai nou
- npm sau yarn
- Git
- Un browser modern
- Cont GitHub (pentru deployment)

### Verificare Instalare

```bash
node --version  # trebuie să fie >=18.0.0
npm --version   # trebuie să fie >=9.0.0
git --version
```

---

## 2. Setup Supabase

### Pas 1: Creare Cont și Proiect

1. Accesează [supabase.com](https://supabase.com)
2. Click pe "Start your project"
3. Creează un cont gratuit (poți folosi GitHub)
4. Click pe "New Project"
5. Completează:
   - **Name**: bucatarie-cresa (sau alt nume)
   - **Database Password**: Generează o parolă puternică (SALVEAZĂ-O!)
   - **Region**: Alege cel mai apropiat de tine (ex: Europe West)
   - **Pricing Plan**: Free
6. Click "Create new project"
7. Așteaptă 1-2 minute până se creează proiectul

### Pas 2: Rulare Schema SQL

1. În dashboard-ul Supabase, mergi la **SQL Editor** (iconița din stânga)
2. Click pe "New query"
3. Deschide fișierul `database-schema.sql` din proiect
4. Copiază ÎNTREGUL conținut
5. Lipește în SQL Editor
6. Click pe "Run" (sau Ctrl+Enter)
7. Ar trebui să vezi mesajul "Success. No rows returned"

### Pas 3: Verificare Tabele

1. Mergi la **Database** → **Tables** în sidebar
2. Ar trebui să vezi 4 tabele:
   - `ingrediente`
   - `retete`
   - `reteta_ingrediente`
   - `rapoarte`

### Pas 4: Obține Cheile API

1. Mergi la **Settings** → **API**
2. Găsește secțiunea "Project API keys"
3. **COPIAZĂ ȘI SALVEAZĂ**:
   - **Project URL**: Arată ca `https://xxxxxxxxx.supabase.co`
   - **anon public**: Cheia publică (un JWT lung)

⚠️ **IMPORTANT**: Nu partaja niciodată aceste chei public pe GitHub sau alte locuri!

---

## 3. Configurare Locală

### Pas 1: Clone Repository

```bash
git clone <url-repository>
cd CalculatorIgediente/bucatarie-cresa
```

### Pas 2: Instalare Dependențe

```bash
npm install
```

Ar trebui să vezi instalarea a ~400 pachete. Durează 1-2 minute.

### Pas 3: Configurare Variabile Mediu

1. Copiază fișierul exemplu:
```bash
cp .env.local.example .env.local
```

2. Deschide `.env.local` într-un editor
3. Înlocuiește valorile:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_NUME_CRESA=Creșa Soarele
```

⚠️ **Verifică**:
- URL-ul se termină cu `.supabase.co`
- Cheia începe cu `eyJ`
- Numele creșei este corect

---

## 4. Populare Date Inițiale

### Opțiunea 1: Import Manual în Supabase (Recomandat)

1. Mergi în Supabase la **Database** → **Tables**
2. Selectează tabelul `ingrediente`
3. Click pe "Insert" → "Insert row"
4. Deschide `data/ingrediente-initiale.json`
5. Pentru fiecare ingredient din JSON:
   - Click "Insert row"
   - Completează câmpurile
   - Click "Save"

### Opțiunea 2: Import prin API (Avansat)

Creează un script `seed.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const ingrediente = require('./data/ingrediente-initiale.json');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
  for (const ing of ingrediente) {
    const { error } = await supabase
      .from('ingrediente')
      .insert(ing);

    if (error) {
      console.error('Error:', ing.denumire, error);
    } else {
      console.log('✓ Added:', ing.denumire);
    }
  }
}

seed();
```

Rulează:
```bash
node seed.js
```

---

## 5. Testare Locală

### Pornire Server Development

```bash
npm run dev
```

Ar trebui să vezi:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in 2.3s
```

### Verificări

1. **Accesează** http://localhost:3000
   - Ar trebui să vezi pagina principală cu header-ul

2. **Testează navigarea**:
   - Click pe "Ingrediente" → ar trebui să vadă pagina ingrediente
   - Click pe "Rețete" → ar trebui să vadă pagina rețete
   - Click pe "Istoric" → ar trebui să vadă pagina istoric

3. **Verifică Console-ul Browser**:
   - Apasă F12
   - Tab "Console"
   - **NU** ar trebui să vezi erori roșii

### Rezolvare Erori Comune

#### Eroare: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Eroare: "NEXT_PUBLIC_SUPABASE_URL is required"
- Verifică că ai creat `.env.local`
- Verifică că numele variabilelor este corect
- Repornește serverul (`Ctrl+C` apoi `npm run dev`)

---

## 6. Deploy Vercel

### Pas 1: Pregătire Repository

1. Asigură-te că toate schimbările sunt commit-ate:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **VERIFICĂ** că `.env.local` NU este în repository:
```bash
git status
```
Dacă apare `.env.local`, adaugă-l în `.gitignore`!

### Pas 2: Creare Cont Vercel

1. Accesează [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Selectează "Continue with GitHub"
4. Autorizează Vercel să acceseze repository-urile

### Pas 3: Import Project

1. În Vercel dashboard, click "Add New..." → "Project"
2. Găsește repository-ul tău
3. Click "Import"
4. **Framework Preset**: Next.js (ar trebui detectat automat)
5. **Root Directory**: `bucatarie-cresa`
6. Click pe "Environment Variables"

### Pas 4: Configurare Variabile Mediu

Adaugă fiecare variabilă:

1. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: URL-ul Supabase

2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Cheia Supabase

3. **Name**: `NEXT_PUBLIC_NUME_CRESA`
   - **Value**: Numele creșei tale

⚠️ Verifică că ai copiat corect - NU lăsa spații la început/sfârșit!

### Pas 5: Deploy

1. Click "Deploy"
2. Așteaptă 2-3 minute
3. Vei vedea confetti 🎉 când e gata!

### Pas 6: Verificare URL

1. Click pe imaginea/screenshot-ul aplicației
2. Se va deschide aplicația ta live!
3. URL-ul va fi ceva de genul: `https://nume-proiect.vercel.app`

---

## 7. Testare în Producție

### Checklist Testare

- [ ] Pagina principală se încarcă
- [ ] Header-ul apare corect
- [ ] Toate link-urile din navigare funcționează
- [ ] Nu sunt erori în Console (F12)
- [ ] Pagina se încarcă rapid (< 2 secunde)

### Test Conectare Database

Pentru a testa că baza de date funcționează, poți adăuga un ingredient de test manual în Supabase și verifica că apare în aplicație (după implementarea completă).

---

## 8. Troubleshooting

### Build Failed pe Vercel

**Simptom**: Build-ul eșuează cu erori TypeScript

**Soluție**:
```bash
# Local, rulează:
npm run build

# Fixează toate erorile raportate
# Apoi commit și push
```

### Aplicația nu se conectează la Supabase

**Simptom**: Erori 401/403 în Network tab

**Soluții**:
1. Verifică că variabilele mediu sunt setate corect în Vercel
2. Verifică că RLS policies sunt activate în Supabase
3. Verifică că cheia API este cheia "anon public", nu "service_role"

### Tabele nu apar în Supabase

**Simptom**: Erori "relation does not exist"

**Soluție**:
1. Mergi în SQL Editor
2. Rulează din nou `database-schema.sql`
3. Verifică că nu sunt erori SQL

### Aplicația e lentă

**Cauze posibile**:
- Imagini prea mari
- Prea multe request-uri la database
- Region Supabase prea departe

**Soluții**:
- Optimizează query-urile
- Adaugă caching
- Migrează Supabase într-un region mai aproape

---

## 🎯 Next Steps

După ce ai deploiat cu succes aplicația:

1. ✅ Testează toate funcționalitățile
2. ✅ Adaugă ingrediente în database
3. ✅ Creează câteva rețete
4. ✅ Generează un raport de test
5. ✅ Descarcă PDF-ul

---

## 📞 Suport

Dacă întâmpini probleme:

1. Verifică secțiunea Troubleshooting
2. Consultă documentația:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vercel Docs](https://vercel.com/docs)

---

## 📝 Checklist Finală

Înainte de a considera deployment-ul complet:

- [ ] Supabase setup complet
- [ ] Database schema created
- [ ] RLS policies active
- [ ] Ingrediente seed data adăugate
- [ ] Variabile mediu configurate
- [ ] Aplicația rulează local fără erori
- [ ] Repository push-uit pe GitHub
- [ ] Vercel deployment reușit
- [ ] Aplicația funcționează în producție
- [ ] Toate paginile se încarcă corect

**Felicitări! Aplicația ta este live! 🎉**
