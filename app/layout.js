import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/error-boundary";
import { SkipToMainContent } from "@/components/accessibility-helper";
import PerformanceMonitor from "@/components/performance-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <SkipToMainContent />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <Header />
              <main id="main-content" className="min-h-screen" role="main">
                {children}
              </main>
              <Toaster richColors />

              <footer className="bg-muted/50 py-12" role="contentinfo">
                <div className="container mx-auto px-4 text-center text-gray-200">
                  <p>2025 all Copyrights reserved NextStepAi</p>
                </div>
              </footer>
              <PerformanceMonitor />
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
