import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sofia_Sans_Extra_Condensed } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { person } from "@/content/site";
import { Cursor } from "@/components/Cursor";
import { FloatingContact } from "@/components/FloatingContact";
import { PageTransition } from "@/components/PageTransition";
import { Preloader } from "@/components/Preloader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PRELOAD_SCRIPT } from "@/lib/preload";
import { siteUrl } from "@/lib/site-url";

const display = Sofia_Sans_Extra_Condensed({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-sofia" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = `${person.name} — ${person.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${person.name}` },
  description: person.intro,
  authors: [{ name: person.name, url: person.github }],
  openGraph: { type: "website", title, description: person.intro, siteName: person.name },
  twitter: { card: "summary_large_image", title, description: person.intro },
};

export const viewport: Viewport = { themeColor: "#efede7", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOAD_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed top-3 left-3 z-[110] -translate-y-24 rounded-full bg-ink px-4 py-3 text-paper focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Preloader name={person.name} />
        <SiteHeader />
        <main id="main" className="relative">
          {children}
        </main>
        <SiteFooter />
        <FloatingContact />
        <PageTransition />
        <Cursor />
      </body>
    </html>
  );
}
