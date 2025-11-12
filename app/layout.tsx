import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Toaster } from 'sonner'
import "./globals.css";
import Providers from "./providers";
import SplashScreen from "@/components/SplitScreen";

const font = Raleway({
  variable: "--font-denly",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional
  // display: "swap",
});

export const metadata: Metadata = {
  title: "Denly",
  description: "Rental properties made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.variable}>
      <body className="antialiased font-(--font-denly)">
        <Providers>
          <Toaster position="bottom-center" richColors />
          <SplashScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
