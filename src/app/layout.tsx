import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Literatuya",
  description:
    "Descubre y comparte desafíos literarios interesantes y auténticos",
  generator: "Next.js",
  applicationName: "Literatuya",
  keywords: ["literatura", "literatuya", "literatuya.vercel.app"],
  authors: [
    {
      name: "Federico Marquez",
      url: "https://new-portfolio-bynano.vercel.app",
    },
  ],
  creator: "Federico Marquez",
  publisher: "Federico Marquez",
  metadataBase: new URL("https://literatuya.vercel.app"),
  openGraph: {
    title: "Literatuya",
    description:
      "Descubre y comparte desafíos literarios interesantes y auténticos",
    url: "https://literatuya.vercel.app",
    siteName: "Literatuya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Literatuya",
    description:
      "Descubre y comparte desafíos literarios interesantes y auténticos",
    images: ["https://literatuya.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://literatuya.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
