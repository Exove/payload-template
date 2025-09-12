import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { buildC15TClientOptions } from "@/lib/c15t-config";
import { SITE_NAME } from "@/lib/constants";
import { ConsentManagerDialog, ConsentManagerProvider, CookieBanner } from "@c15t/nextjs";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: SITE_NAME,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
  },
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-stone-900 text-white ring`}
      >
        <NextIntlClientProvider messages={messages}>
          <ConsentManagerProvider options={buildC15TClientOptions(locale)}>
            <div className="flex-grow">{children}</div>
            <Footer />
            <Toaster />
            <CookieBanner
              theme={{
                "banner.footer.customize-button":
                  "!text-gray-400 !ring-0 !bg-transparent hover:!ring-1 hover:ring-gray-400",
                "banner.footer.accept-button": "!text-gray-400 hover:!ring-1 hover:ring-gray-400",
                "banner.footer.reject-button": "!text-gray-400 hover:!ring-1 hover:ring-gray-400",
              }}
            />
            <ConsentManagerDialog />
          </ConsentManagerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
