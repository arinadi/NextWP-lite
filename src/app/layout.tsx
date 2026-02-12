import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextWP-lite",
  description: "Modern Serverless CMS - Built with Next.js 16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
