"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Github, Twitter, Mail, Heart, FileText, ArrowUp } from "lucide-react";

export function Footer() {
  const tablet = useMediaQuery("(max-width: 1024px)");
  const mobile = useMediaQuery("(max-width: 768px)");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Templates", href: "/templates" },
      { name: "Integrations", href: "/integrations" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "API Docs", href: "/docs" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "GitHub", icon: Github, href: "https://github.com" },
  ];

  return (
    <footer id="footer" className="w-full pb-0 px-6 bg-background border-t">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="py-12">
          <div
            className={`grid ${
              mobile
                ? "grid-cols-1 gap-8"
                : tablet
                ? "grid-cols-2 gap-12"
                : "grid-cols-5 gap-8"
            }`}
          >
            {/* Brand Section */}
            <div
              className={
                mobile ? "col-span-1" : tablet ? "col-span-2" : "col-span-2"
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">FormBuilder</span>
                </div>
                <p className="text-muted-foreground max-w-sm">
                  Create beautiful forms with payment integration and Google
                  Sheets sync. Simple, fast, and reliable form builder for
                  everyone.
                </p>

                {/* Social Links */}
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon className="h-4 w-4" />
                        <span className="sr-only">{social.name}</span>
                      </Link>
                    </Button>
                  ))}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="mailto:hello@formbuilder.com">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className={mobile ? "col-span-1" : "col-span-1"}>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className={mobile ? "col-span-1" : "col-span-1"}>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className={mobile ? "col-span-1" : "col-span-1"}>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Section */}
        <div className="py-6">
          <div
            className={`flex ${
              mobile ? "flex-col gap-4 text-center" : "flex-row"
            } items-center justify-between`}
          >
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {currentYear} FormBuilder.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for form creators</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              {!mobile && "Back to top"}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
