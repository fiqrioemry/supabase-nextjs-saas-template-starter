"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Sheet, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center w-full max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Build Forms That <span className="text-red-500">Convert</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          A simple yet powerful form builder with{" "}
          <span className="font-semibold text-foreground">
            Payment Gateway, Webhooks
          </span>{" "}
          and{" "}
          <span className="font-semibold text-foreground">
            Google Sheets integration
          </span>
          . Launch in minutes, scale without limits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <Button size="lg" className="bg-red-500 hover:bg-red-600">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline">
            Live Demo
          </Button>
        </motion.div>
      </section>

      {/* Use Case Section */}
      <section className="w-full max-w-6xl px-6 py-20 grid gap-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Use Cases
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          From startups to enterprises, automate your workflow and collect data
          seamlessly with our integrations.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <CreditCard className="h-10 w-10 text-red-500" />
            <h3 className="mt-4 font-semibold text-lg">
              Payment Gateway & Webhooks
            </h3>
            <p className="mt-2 text-muted-foreground">
              Collect payments directly in your forms, integrate with Stripe,
              Midtrans, or Xendit, and trigger webhooks for custom automation.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <Sheet className="h-10 w-10 text-red-500" />
            <h3 className="mt-4 font-semibold text-lg">
              Google Sheets Integration
            </h3>
            <p className="mt-2 text-muted-foreground">
              Sync submissions instantly to Google Sheets, enabling real-time
              reporting and collaboration with your team.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <Zap className="h-10 w-10 text-red-500" />
            <h3 className="mt-4 font-semibold text-lg">Automation Ready</h3>
            <p className="mt-2 text-muted-foreground">
              Connect with Zapier, Make, or Slack to automate notifications,
              workflows, and boost productivity.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
