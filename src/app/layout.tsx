import "./globals.css"

export const metadata = {
  title: "EchoLingo",
  description: "Live translation and voice cloning",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
