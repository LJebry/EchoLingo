import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = {
  title: "EchoLingo",
  description: "Live translation and voice cloning",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body className="font-sans bg-[#040915] text-on-surface antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
