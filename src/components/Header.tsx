import { Link } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { Article, CollectionPage } from "@/payload-types";
import { MenuItem } from "@/types/menu";
import configPromise from "@payload-config";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import LanguageSwitcher from "./LanguageSwitcher";
import { MobileMenu } from "./MainMenu";
import SearchSidePanel from "./SearchPanel";
import SimpleMenu from "./SimpleMenu";

type CollectionPageItem = {
  id: number;
  title: string;
  slug: string;
  subPages?: { id: number; title: string; slug: string }[];
};

export default async function Header() {
  const t = await getTranslations("header");
  const payload = await getPayload({
    config: configPromise,
  });

  const mainMenu = await payload.findGlobal({
    slug: "main-menu",
    depth: 1,
  });

  const locale = (await getLocale()) as "fi" | "en";

  const collectionPagesRes = await payload.find({
    collection: "collection-pages",
    depth: 2,
    locale: locale as "fi" | "en",
    draft: false,
    limit: 200,
    sort: "title",
  });

  const simpleMenuItems: CollectionPageItem[] = (collectionPagesRes.docs as CollectionPage[]).map(
    (doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      subPages: Array.isArray(doc.subPages)
        ? (
            doc.subPages
              .map((sp) => (typeof sp === "object" ? (sp as Article) : null))
              .filter(Boolean) as Article[]
          ).map((a) => ({ id: a.id, title: a.title, slug: a.slug }))
        : [],
    }),
  );

  return (
    <header>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        {t("skipToContent")}
      </a>
      <div className="flex w-full justify-center pt-4 xl:hidden">
        <Link href="/" className="text-xl font-bold">
          {SITE_NAME}
        </Link>
      </div>
      <div className="container mx-auto flex items-center justify-between px-4 py-4 xl:px-0">
        <div className="xl:hidden">
          <MobileMenu items={mainMenu.items as MenuItem[]} />
        </div>
        <div className="lg:w-[300px]">
          <Link href="/" className="hidden text-xl font-bold xl:block">
            {SITE_NAME}
          </Link>
        </div>
        <div className="hidden lg:flex-1 xl:block">
          <SimpleMenu items={simpleMenuItems} locale={locale as "fi" | "en"} />
        </div>
        <ul className="flex items-center justify-end gap-8 lg:w-[300px]">
          <li>
            <SearchSidePanel />
          </li>
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </header>
  );
}
