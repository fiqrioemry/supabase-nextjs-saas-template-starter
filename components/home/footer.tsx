"use client";

import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full bg-background border-t">
      <div className="max-w-6xl mx-auto">
        <div className="py-6 flex items-center justify-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <span className="font-bold">MYSAAS</span>
            <span>Created with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>ahmad fiqri oemry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
