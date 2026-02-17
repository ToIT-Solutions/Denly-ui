import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SplashScreen from "@/components/SplitScreen";
import { RedirectHandler } from "@/components/RedirectHandler";

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
          <RedirectHandler>
            <SplashScreen />
            {children}
          </RedirectHandler>
        </Providers>
      </body>
    </html>
  );
}
