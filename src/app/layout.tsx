import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CampusData from "./context/CampusData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UC Berkeley Room Finder",
  description: "UC Berkeley Libraries are too packed. Find an empty room  to study in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CampusData>  
          {children}
        </CampusData>
        </body>
    </html>
  );
}
