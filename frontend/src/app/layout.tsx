import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import BackendWarmup from "@/components/BackendWarmup";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOLIX – AI Energy Intelligence",
  description: "AI-powered energy forecasting and optimization platform",
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('solix-theme') || 'dark';
    var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var c = document.documentElement.classList;
    if (d) { c.add('dark'); c.remove('light'); } else { c.add('light'); c.remove('dark'); }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={hanken.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className="bg-background text-foreground antialiased min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <BackendWarmup />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}