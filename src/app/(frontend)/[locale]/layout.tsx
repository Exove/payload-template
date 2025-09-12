import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { SITE_NAME } from "@/lib/constants";
import { ConsentManagerDialog, ConsentManagerProvider, CookieBanner } from "@c15t/nextjs";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: SITE_NAME,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
  },
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-stone-900 text-white`}>
        <NextIntlClientProvider messages={messages}>
          <ConsentManagerProvider
            options={{
              mode: "c15t",
              backendURL: "/api/c15t",
              consentCategories: ["necessary", "marketing"], // Optional: Specify which consent categories to show in the banner.
              ignoreGeoLocation: true, // Useful for development to always view the banner.
            }}
          >
            <div className="flex-grow">{children}</div>
            <Footer />
            <Toaster />
            <CookieBanner />
            <ConsentManagerDialog />
          </ConsentManagerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
