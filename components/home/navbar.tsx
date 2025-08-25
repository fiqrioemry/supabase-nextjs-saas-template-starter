"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-providers";
import { ThemeToggle } from "@/components/home/theme-toggle";
import { AnimatePresence, motion, useScroll } from "framer-motion";

const INITIAL_WIDTH = "70rem";
const MAX_WIDTH = "1000px";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export async function Navbar() {
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  const logoSrc = !mounted
    ? "/kortix-logo.svg"
    : resolvedTheme === "dark"
    ? "/kortix-logo-white.svg"
    : "/kortix-logo.svg";

  return (
    <header
      className={cn(
        "sticky z-50 flex justify-center transition-all duration-300",
        hasScrolled ? "top-6 mx-4 md:mx-0" : "top-4 mx-2 md:mx-0"
      )}
    >
      <motion.div
        initial={{ width: INITIAL_WIDTH }}
        animate={{ width: hasScrolled ? MAX_WIDTH : INITIAL_WIDTH }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-2xl transition-all duration-300 xl:px-0",
            hasScrolled
              ? "px-2 md:px-2 border border-border backdrop-blur-lg bg-background/75"
              : "shadow-none px-3 md:px-7"
          )}
        >
          <div className="flex h-[56px] items-center p-2 md:p-4">
            {/* Left Section - Logo */}
            <div className="flex items-center justify-start flex-shrink-0 w-auto md:w-[200px]">
              <Link href="/" className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Formgen.io</h1>
              </Link>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center justify-end flex-shrink-0 w-auto md:w-[200px] ml-auto">
              <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
                <ThemeToggle />

                <div className="flex items-center space-x-3">
                  {user ? (
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/signin">Get Started</Link>
                    </Button>
                  )}
                </div>

                <button
                  className="md:hidden border border-border size-8 rounded-md cursor-pointer flex items-center justify-center"
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
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-x-0 w-[95%] mx-auto bottom-3 bg-background border border-border p-4 rounded-xl shadow-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Mobile menu content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">Formgen.io</h1>
                  </Link>
                  <button
                    onClick={toggleDrawer}
                    className="border border-border rounded-md p-1 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  {user ? (
                    <Button asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/dashboard">Get Started</Link>
                    </Button>
                  )}
                  <div className="flex justify-between">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
