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
  appleWebApp: {
    capable: true,
    title: "Infinitum",
    statusBarStyle: "#000000",
  },
};

export const viewport = {
  themeColor: "#000000",
};

import StylesProvider from "@/components/ThemeRegistry";
import ClientTemplate from "@/components/ClientTemplate/ClientTemplate";
import { AuthProvider } from "@/context/AuthContext";
import { SoundProvider } from "@/context/SoundContext";
import { ShutterProvider } from "@/context/ShutterContext";
import { PopupProvider } from "@/context/PopupContext";
import CircularMenu from "@/components/CircularMenu/CircularMenu";
import SoundMuteButton from "@/components/SoundMuteButton/SoundMuteButton";
import GrievanceButton from "@/components/GrievanceButton/GrievanceButton";
import CircularMenuWrapper from "@/components/CircularMenu/CircularMenuWrapper";
import { PreRegistrationProvider } from "@/context/PreRegistrationContext";
import PreRegistrationModal from "@/components/PreRegistrationModal";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://vercel-umami-roan.vercel.app/script.js" data-website-id="b2b707b1-166d-4651-b54f-af7bb33bc3d7"></script>
        <link
          rel="stylesheet"
          href="//cdn.materialdesignicons.com/3.0.39/css/materialdesignicons.min.css"
        />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className={`${orbitron.variable} ${electrolize.variable}`} suppressHydrationWarning>
        <StylesProvider>
          <SoundProvider>
            <PopupProvider>
              <AuthProvider>
                <PreRegistrationProvider>
                  <ShutterProvider>
                    <ClientTemplate>
                      {children}
                    </ClientTemplate>
                    <CircularMenuWrapper />
                    <SoundMuteButton />
                    <GrievanceButton />
                    <PreRegistrationModal />
                  </ShutterProvider>
                </PreRegistrationProvider>
              </AuthProvider>
            </PopupProvider>
          </SoundProvider>
        </StylesProvider>
      </body>
    </html>
  );
}