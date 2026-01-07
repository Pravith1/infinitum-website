import { Orbitron, Electrolize } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const electrolize = Electrolize({
  variable: "--font-electrolize",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Infinitum",
  description: "Computer Science Association Presents Infinitum",
  keywords: "infinitum, computer science, association, event",
  robots: "index, follow",
  openGraph: {
    title: "Infinitum",
    siteName: "Infinitum",
    description: "Computer Science Association Presents Infinitum",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinitum",
    description: "Computer Science Association Presents Infinitum",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    title: "Infinitum",
    statusBarStyle: "#000000",
  },
};

import StylesProvider from "@/components/ThemeRegistry";
import ClientTemplate from "@/components/ClientTemplate/ClientTemplate";
import { AuthProvider } from "@/context/AuthContext";
import { ShutterProvider } from "@/context/ShutterContext";
import CircularMenu from "@/components/CircularMenu/CircularMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="//cdn.materialdesignicons.com/3.0.39/css/materialdesignicons.min.css"
        />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className={`${orbitron.variable} ${electrolize.variable}`} suppressHydrationWarning>
        <StylesProvider>
          <AuthProvider>
            <ShutterProvider>
              <ClientTemplate>
                {children}
              </ClientTemplate>
              <CircularMenu />
            </ShutterProvider>
          </AuthProvider>
        </StylesProvider>
      </body>
    </html>
  );
}