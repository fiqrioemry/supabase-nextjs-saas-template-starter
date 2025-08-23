# Setup Guide - Next.js Supabase Starter

Panduan lengkap untuk mengatur dan menjalankan starter template ini.

## 📋 Prerequisites

Pastikan Anda memiliki:

- Node.js 18+
- npm/yarn/pnpm
- Akun Supabase (gratis)
- Git

## 🔧 Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd nextjs-supabase-starter

# Install dependencies
npm install
```

### 2. Setup Supabase Project

1. **Buat Project Baru**

   - Buka [supabase.com](https://supabase.com)
   - Klik "New Project"
   - Pilih organization dan beri nama project
   - Pilih region (Singapore untuk Indonesia)
   - Buat password database yang kuat

2. **Dapatkan API Keys**
   - Pergi ke Project Settings > API
   - Copy `Project URL` dan `anon public key`

### 3. Environment Variables

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Ganti dengan credentials Supabase Anda
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional untuk production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Schema

1. **Buka Supabase SQL Editor**

   - Pergi ke SQL Editor di dashboard Supabase
   - Klik "New Query"

2. **Jalankan Migration**
   - Copy semua isi dari `supabase/*.sql`
   - Paste di SQL Editor
   - Klik "Run"

Migration akan membuat:

- Table `profiles` dengan RLS policies
- Function untuk auto-create profile
- Trigger untuk updated_at
- Indexes untuk performance

### 5. Konfigurasi OAuth (Opsional)

#### Google OAuth

1. **Google Cloud Console**

   - Buka [console.cloud.google.com](https://console.cloud.google.com)
   - Buat project baru atau pilih existing
   - Enable Google+ API
   - Pergi ke Credentials > Create Credentials > OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`

2. **Supabase Configuration**
   - Pergi ke Authentication > Providers > Google
   - Enable Google provider
   - Masukkan Client ID dan Client Secret
   - Save configuration

#### GitHub OAuth

1. **GitHub Settings**

   - Pergi ke GitHub Settings > Developer settings > OAuth Apps
   - New OAuth App
   - Authorization callback URL: `http://localhost:3000/auth/callback`

2. **Supabase Configuration**
   - Pergi ke Authentication > Providers > GitHub
   - Enable GitHub provider
   - Masukkan Client ID dan Client Secret

### 6. Email Templates (Opsional)

Customize email templates di Supabase:

1. Pergi ke Authentication > Email Templates
2. Edit "Confirm signup" template
3. Update subject dan body sesuai brand Anda

### 7. Start Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## ✅ Testing Setup

### Test Basic Flow

1. **Home Page** (`/`)

   - Pastikan tombol "Get Started" dan "Sign In" berfungsi

2. **Sign Up** (`/signup`)

   - Test form validation
   - Coba daftar dengan email valid
   - Pastikan OTP verification muncul

3. **Email Verification**

   - Check email untuk OTP code
   - Masukkan code di form verification
   - Pastikan redirect ke dashboard

4. **Sign In** (`/signin`)

   - Test login dengan credentials yang sudah dibuat
   - Test OAuth providers (jika sudah dikonfigurasi)

5. **Dashboard** (`/dashboard`)
   - Pastikan profile data ditampilkan
   - Test sign out

### Debug Common Issues

**1. Supabase Connection Error**

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**2. Database Permission Error**

```sql
-- Check RLS policies in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**3. OAuth Redirect Error**

- Pastikan redirect URL exactly match
- Check OAuth app settings di provider
- Verify Supabase Auth configuration

## 🚀 Production Deployment

### Vercel Deployment

1. **Push to Git**

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

2. **Deploy ke Vercel**

   - Connect GitHub repo ke Vercel
   - Add environment variables
   - Deploy

3. **Update OAuth Redirect URLs**
   - Google: Add `https://your-domain.com/auth/callback`
   - GitHub: Update Authorization callback URL
   - Supabase: Update Site URL in Auth settings

### Environment Variables untuk Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔍 Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Home page loads correctly
- [ ] Sign up flow works end-to-end
- [ ] Email verification functional
- [ ] Sign in flow works
- [ ] Dashboard shows user data
- [ ] Sign out works
- [ ] OAuth providers work (if configured)
- [ ] Middleware protects routes
- [ ] TypeScript compiles without errors

## 📞 Troubleshooting

### Common Issues

1. **Module not found errors**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Supabase connection timeout**

   - Check internet connection
   - Verify Supabase project is not paused
   - Check API keys are correct

3. **Email not sending**

   - Check Supabase Auth > Settings
   - Verify email templates are enabled
   - Check spam folder

4. **OAuth not working**
   - Verify redirect URLs match exactly
   - Check OAuth provider settings
   - Test with incognito mode

### Get Help

- Check [Supabase Docs](https://supabase.com/docs)
- Review [Next.js Docs](https://nextjs.org/docs)
- Open GitHub issue for bugs

---

Setelah setup selesai, Anda siap untuk mulai development! 🎉
