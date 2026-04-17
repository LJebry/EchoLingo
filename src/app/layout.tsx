import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

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
      <body className="font-sans bg-surface text-on-surface pb-24">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
