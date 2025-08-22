import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Palette } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to
              <span className="block text-primary">Next.js Starter</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern full-stack starter template with Next.js 14, Supabase,
              TypeScript, and TailwindCSS. Get started building your next great
              idea.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Built-in authentication with Supabase Auth, including OAuth
                providers and email verification.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Next.js 14 with App Router, TypeScript, TanStack Query, and
                Zustand for optimal developer experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Beautiful UI</CardTitle>
              <CardDescription>
                TailwindCSS with shadcn/ui components for a polished and
                accessible user interface.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold">Built with Modern Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">Next.js 14</span>
            <span className="px-3 py-1 bg-muted rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-muted rounded-full">Supabase</span>
            <span className="px-3 py-1 bg-muted rounded-full">TailwindCSS</span>
            <span className="px-3 py-1 bg-muted rounded-full">shadcn/ui</span>
            <span className="px-3 py-1 bg-muted rounded-full">
              TanStack Query
            </span>
            <span className="px-3 py-1 bg-muted rounded-full">Zustand</span>
            <span className="px-3 py-1 bg-muted rounded-full">
              React Hook Form
            </span>
            <span className="px-3 py-1 bg-muted rounded-full">Zod</span>
          </div>
        </div>
      </div>
    </main>
  );
}
