import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import MainMenu from "./components/MainMenu";
import BackToTop from "./components/ui/BackToTop";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "Veselības un skaistuma centrs Adoria",
  description: "Veselības centrs pašā Rīgas centrā",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <SessionProvider>
          <TopBar />
          <MainMenu />
          <BackToTop />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                maxWidth: '500px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(183, 171, 150, 0.2)',
                zIndex: 9999,
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
                style: {
                  backgroundColor: '#F0FDF4',
                  color: '#065F46',
                  border: '1px solid #10B981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
                style: {
                  backgroundColor: '#FEF2F2',
                  color: '#991B1B',
                  border: '1px solid #EF4444',
                },
              },
            }}
          />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
