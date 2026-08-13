# 🎓 Triangle ESL — Web App

> **Learn More. Speak More. Connect More.**
> Personalized online English classes for all ages and levels.
> Built with React + Supabase · Iligan City, Philippines

---

## 📁 Project Structure

```
triangle-esl/
├── index.js                        ← React entry point
├── package.json
├── src/
│   ├── App.jsx                     ← Root router + shared state
│   ├── styles/
│   │   ├── global.css              ← Fonts, keyframes, scrollbar
│   │   └── theme.js                ← Brand color constants
│   ├── lib/
│   │   └── supabase.js             ← ⚡ Supabase REST client (configure here)
│   ├── data/
│   │   ├── images.js               ← Base64 embedded teacher/logo photos
│   │   ├── teachers.js             ← Teacher profiles data
│   │   ├── packages.js             ← Pricing packages data
│   │   └── constants.js            ← Time slots, levels, FAQs, contact info
│   ├── components/
│   │   ├── ui/                     ← Reusable design primitives
│   │   │   ├── index.js            ← Barrel export for all UI components
│   │   │   ├── Eyebrow.jsx         ← Small label tag
│   │   │   ├── Title.jsx           ← Section heading
│   │   │   ├── Subtitle.jsx        ← Section subheading
│   │   │   ├── Card.jsx            ← White card with border
│   │   │   ├── Field.jsx           ← Form field wrapper with label + error
│   │   │   ├── GoldBtn.jsx         ← Primary gold button
│   │   │   ├── GhostBtn.jsx        ← Ghost button (for dark backgrounds)
│   │   │   ├── SecBtn.jsx          ← Secondary outline button
│   │   │   ├── NavBtn.jsx          ← Navbar link button
│   │   │   ├── Counter.jsx         ← Animated count-up number
│   │   │   └── FloatDots.jsx       ← Decorative floating dot background
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          ← Sticky top navigation bar
│   │   │   └── Footer.jsx          ← Site footer with links & contact
│   │   └── sections/
│   │       ├── MascotHero.jsx      ← Animated mascot hero with orbits
│   │       ├── DemoModal.jsx       ← Free demo booking modal
│   │       ├── TeacherCard.jsx     ← Individual teacher profile card
│   │       ├── PricingCard.jsx     ← Package pricing card
│   │       └── FAQ.jsx             ← Accordion FAQ component
│   └── pages/
│       ├── HomePage.jsx            ← About / home page
│       ├── TeachersPage.jsx        ← All teacher profiles
│       ├── PricingPage.jsx         ← Packages & comparison table
│       ├── BookingPage.jsx         ← 4-step booking flow
│       └── AdminPage.jsx           ← Admin dashboard (Supabase-connected)
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm start
```

App runs at **http://localhost:3000**

---

## ⚡ Connect Supabase (Required for live data)

### Step 1 — Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. Create a new project.
3. Copy your **Project URL** and **anon/public API key** from  
   `Project Settings → API`.

### Step 2 — Add credentials

Open `src/lib/supabase.js` and replace:

```js
export const SUPABASE_URL      = "https://your-project-ref.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key-here";
```

### Step 3 — Create database tables

Run this SQL in your Supabase **SQL Editor**:

```sql
-- Class bookings
CREATE TABLE bookings (
  id          bigserial PRIMARY KEY,
  name        text,
  email       text,
  teacher     text,
  slot        text,
  level       text,
  pkg         text,
  amount      text,
  status      text DEFAULT 'Confirmed',
  date        text,
  created_at  timestamptz DEFAULT now()
);

-- Free demo requests
CREATE TABLE demo_requests (
  id             bigserial PRIMARY KEY,
  name           text,
  email          text,
  preferred_slot text,
  english_level  text,
  created_at     timestamptz DEFAULT now()
);
```

### Step 4 — Enable Row Level Security (optional but recommended)

```sql
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests  ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for demo booking & class booking forms)
CREATE POLICY "Allow anon insert on bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert on demo_requests"
  ON demo_requests FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow auth read on bookings"
  ON bookings FOR SELECT TO authenticated USING (true);
```

---

## 🔐 Admin Dashboard

- Navigate to **Admin** in the navbar.
- Password: `admin123`  
  *(change this in `src/pages/AdminPage.jsx` → `login()` function)*
- The dashboard shows:
  - Live booking data from Supabase (when connected)
  - Fallback to local demo data if Supabase is not configured
  - Search by student name, email, or teacher
  - Filter by status: All / Confirmed / Pending
  - Stats: Total bookings, confirmed, pending, revenue, unique students

---

## 🎨 Brand & Theme

All brand colors are in `src/styles/theme.js`:

| Token        | Value     | Usage                         |
|--------------|-----------|-------------------------------|
| `gold`       | `#F5A623` | Primary accent, buttons, tags |
| `navy`       | `#0E1829` | Backgrounds, text headings    |
| `teal`       | `#3ABFB1` | Certifications, status badges |
| `pink`       | `#F06292` | Teacher El accent             |
| `purple`     | `#7C3AED` | Teacher Christine accent      |
| `cream`      | `#FFFCF0` | Page background               |

Fonts: **Baloo 2** (headings) + **Nunito** (body) via Google Fonts.

---

## 📞 Contact

| Channel  | Info                                    |
|----------|-----------------------------------------|
| Address  | MEA Bldg., Saray-Tibanga, Iligan City, Philippines 9200 |
| Phone    | 0997 762 2717                           |
| Email    | triangle.esidivision@gmail.com          |
| Facebook | facebook.com/triangleesl                |

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `build/` folder — ready to deploy on Netlify, Vercel, or any static host.

---

*© 2026 Triangle ESL · Iligan City, Philippines*
