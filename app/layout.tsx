import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvanta Solar Energy — Jaipur's Trusted Solar Installer",
  description: "MNRE approved solar panel installation in Jaipur, Rajasthan. PM Surya Ghar authorized. Get ₹78,000 government subsidy on rooftop solar.",
  keywords: "solar panel installation jaipur, solar energy company rajasthan, PM surya ghar yojana, MNRE approved installer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
