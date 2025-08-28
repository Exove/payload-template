import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Locale = "en" | "fi";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
};

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-stone-900 text-white`}>
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            <ViewTransition>
              <div className="flex-grow">{children}</div>
              <Footer />
              <Toaster />
            </ViewTransition>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
