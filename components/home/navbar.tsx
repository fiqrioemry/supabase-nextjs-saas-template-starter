"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-providers";
import { ThemeToggle } from "@/components/home/theme-toggle";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex justify-center transition-all duration-300",
        hasScrolled ? "bg-background/90 shadow-md backdrop-blur-sm" : ""
      )}
    >
      <div className="w-full mx-auto max-w-7xl px-4">
        <div className="flex h-[56px] items-center justify-between">
          {/* Left Section - Logo */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Formgen.io</h1>
          </Link>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden size-9 rounded-md flex items-center justify-center"
              onClick={toggleDrawer}
            >
              {isDrawerOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          <div className="fixed inset-x-0 w-[95%] mx-auto bottom-3 bg-background p-5 rounded-xl shadow-xl">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Formgen.io</h1>
                </Link>
                <button onClick={toggleDrawer} className="p-2 rounded-md">
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {user ? (
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/signin">Get Started</Link>
                  </Button>
                )}
                <div className="flex justify-end">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
