import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "EchoLingo",
  description: "Live translation and voice cloning",
  icons: {
    icon: "/echolingo-mark.svg",
    apple: "/echolingo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#040915] text-on-surface antialiased">
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
