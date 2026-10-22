import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/comon/navbar";
import Footer from "../components/comon/footer";
import FloatingContact from "@/components/comon/FloatingContact";

export const metadata: Metadata = {
  title: {
    default: "Vishwa Nadeen",
    template: "%s | Vishwa Nadeen",
  },
  description:
    "Official portfolio of Vishwa Nadeen - showcasing software development projects, skills, and contact information.",
  keywords: [
    "Vishwa Nadeen",
    "Vishwa Nadeen portfolio",
    "Software Developer Sri Lanka",
    "Full Stack Developer",
    "Next.js Developer",
    "Web Developer",
    "Vinu",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Vishwa Nadeen" }],
  creator: "Vishwa Nadeen",
  metadataBase: new URL("https://www.vishwanadeen.lk"),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Vishwa Nadeen",
    description:
      "Explore projects, skills, and development work by Vishwa Nadeen.",
    url: "https://www.vishwanadeen.lk",
    siteName: "Vishwa Nadeen Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vishwa Nadeen Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vishwa Nadeen",
    description:
      "Explore projects and development work by Vishwa Nadeen.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-120px)]">{children}</main>
        <Footer />

        <FloatingContact />
      </body>
    </html>
  );
}