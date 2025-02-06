import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react"
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          visibleToasts={3}
        />
      </body>
    </html>
  );
}
