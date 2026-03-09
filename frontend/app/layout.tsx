import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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

  openGraph: {
    title: "Vishwa Nadeen",
    description:
      "Explore projects, skills, and development work by Vishwa Nadeen.",
    url: "https://www.vishwanadeen.lk",
    siteName: "Vishwa Nadeen Portfolio",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vishwa Nadeen",
    description:
      "Explore projects and development work by Vishwa Nadeen.",
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
      </body>
    </html>
  );
}