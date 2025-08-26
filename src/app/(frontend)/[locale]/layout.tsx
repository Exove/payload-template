import { Toaster } from "@/components/Toaster";
import { SITE_NAME } from "@/lib/constants";
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
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-stone-900 text-white`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex-grow">{children}</div>

          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
