# Next.js Supabase Starter

A modern, full-stack starter template built with Next.js 14 (App Router), Supabase, TypeScript, and TailwindCSS. This template provides a solid foundation for building scalable web applications with authentication, database integration, and a beautiful UI.

## 🚀 Features

- **Next.js 14** with App Router for optimal performance
- **Supabase** for authentication, database, and storage
- **TypeScript** for type safety and better developer experience
- **TailwindCSS + shadcn/ui** for beautiful, accessible components
- **TanStack Query** for efficient data fetching and caching
- **Zustand** for lightweight state management
- **React Hook Form + Zod** for form handling and validation
- **Middleware** for route protection
- **SSR/CSR** rendering strategies
- **Email verification** with OTP
- **OAuth providers** (Google, GitHub)

## 🏗️ Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 14 (App Router) |
| Language         | TypeScript              |
| Database         | Supabase (PostgreSQL)   |
| Authentication   | Supabase Auth           |
| Styling          | TailwindCSS + shadcn/ui |
| State Management | Zustand                 |
| Data Fetching    | TanStack Query          |
| Form Handling    | React Hook Form + Zod   |
| Icons            | Lucide React            |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication routes
│   ├── dashboard/         # Protected dashboard page
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
│   ├── api/              # Data fetching functions
│   ├── actions/          # Server actions
│   └── zustand/          # State management
├── hooks/                # Custom React hooks
├── schemas/              # Zod validation schemas
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account

### 1. Clone the repository

```bash
git clone <repository-url>
cd nextjs-supabase-starter
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set up database

Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_initial.sql
```

This will create:

- `profiles` table with RLS policies
- Automatic profile creation on user signup
- Proper indexes for performance

### 5. Configure OAuth providers (Optional)

In your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Google and/or GitHub
3. Add your OAuth app credentials
4. Set redirect URLs to: `http://localhost:3000/auth/callback`

### 6. Start development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Pages Overview

| Route            | Description                          | Access    |
| ---------------- | ------------------------------------ | --------- |
| `/`              | Landing page with features overview  | Public    |
| `/signin`        | Sign in form with OAuth options      | Public    |
| `/signup`        | Sign up form with email verification | Public    |
| `/auth/callback` | OAuth callback handler               | Public    |
| `/dashboard`     | User dashboard with profile info     | Protected |

## 🔐 Authentication Flow

1. **Sign Up**: User creates account with email/password + profile info
2. **Email Verification**: User receives OTP email and verifies
3. **Sign In**: User can sign in with email/password or OAuth
4. **Protected Routes**: Middleware redirects unauthenticated users
5. **Profile Management**: Users can view/edit their profile

## 🎨 UI Components

The template uses shadcn/ui components which are:

- **Accessible**: Built with Radix UI primitives
- **Customizable**: Easy to modify with CSS variables
- **Modern**: Contemporary design patterns
- **Type-safe**: Full TypeScript support

Key components included:

- Button, Card, Input, Label, Textarea
- Alert, Avatar, Badge, Separator
- Form components with validation

## 📊 Data Management

### API Layer (`lib/api/`)

- Read operations (GET requests)
- TanStack Query integration
- Client and server functions

### Actions Layer (`lib/actions/`)

- Write operations (POST/PUT/DELETE)
- Server Actions with `'use server'`
- Form submissions and mutations

### Route Handlers (`app/api/`)

- External webhooks
- Third-party integrations
- Complex server-side logic

## 🔄 State Management

**Zustand Store** (`lib/zustand/auth-store.ts`):

- User authentication state
- Profile information
- Loading states
- Persistent storage with session data

**TanStack Query**:

- Server state management
- Caching and synchronization
- Background refetching
- Optimistic updates

## 🛡️ Security

- **Row Level Security (RLS)** on all database tables
- **Middleware protection** for sensitive routes
- **Input validation** with Zod schemas
- **CSRF protection** with Supabase auth helpers
- **Type-safe** database operations

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔧 Customization

### Adding New Pages

1. Create page in `src/app/your-page/page.tsx`
2. Add middleware protection if needed
3. Create corresponding API/actions if required

### Adding New Database Tables

1. Create migration SQL
2. Add types to `src/types/database.ts`
3. Create API functions in `src/lib/api/`
4. Add server actions in `src/lib/actions/`

### Styling Customization

- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme changes
- Customize shadcn/ui components in `src/components/ui/`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zustand Documentation](https://zustand.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉**
