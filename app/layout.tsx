import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { CartItemsProvider } from "@/components/provider/cartItemsProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "MyStore",
  description: "This store is a demo store for WSU major assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <CartItemsProvider>{children}</CartItemsProvider>
      </body>
    </html>
  );
}
