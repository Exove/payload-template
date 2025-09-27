import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from "@/components/Icons";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";

export async function Footer() {
  const locale = (await getLocale()) as Locale;

  const payload = await getPayload({
    config: configPromise,
  });

  const [footerMenu, footer] = await Promise.all([
    payload.findGlobal({
      slug: "footer-menu",
      depth: 1,
      locale: locale,
    }),
    payload.findGlobal({
      slug: "footer",
      locale: locale,
    }),
  ]);

  const t = await getTranslations();

  return (
    <footer className="bg-stone-800 py-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-6 xl:gap-24">
          {/* Company Info */}
          <div className="text-stone-400 md:col-span-2">
            {footer.general?.title && (
              <Heading level="h2" size="sm" className="mb-4 text-white">
                {footer.general.title}
              </Heading>
            )}
            {footer.general?.description && <p className="mb-4">{footer.general?.description}</p>}
            <ul className="flex gap-4">
              {footer.general?.social?.facebook && (
                <li>
                  <Link
                    href={footer.general.social.facebook}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">Facebook</span>
                    <FacebookIcon />
                  </Link>
                </li>
              )}
              {footer.general?.social?.instagram && (
                <li>
                  <Link
                    href={footer.general.social.instagram}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">Instagram</span>
                    <InstagramIcon />
                  </Link>
                </li>
              )}
              {footer.general?.social?.linkedin && (
                <li>
                  <Link
                    href={footer.general.social.linkedin}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <LinkedInIcon />
                  </Link>
                </li>
              )}
              {footer.general?.social?.youtube && (
                <li>
                  <Link
                    href={footer.general.social.youtube}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">YouTube</span>
                    <YoutubeIcon />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Footer Menu */}
          <div className="md:col-span-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {footerMenu.items.map((menuItem, index) => (
                <nav
                  key={index}
                  className="text-stone-400"
                  aria-label={`${t("footer.menuLabel")} ${menuItem.label}`}
                >
                  <Heading level="h2" size="sm" className="mb-4 text-white">
                    {menuItem.label}
                  </Heading>
                  <ul className="space-y-2">
                    {menuItem.children?.map((child, index) => {
                      const { linkUrl, linkLabel } = parseLink(child.link);
                      if (linkUrl) {
                        return (
                          <li key={index}>
                            <Link href={linkUrl} className="hover:text-white">
                              {linkLabel}
                            </Link>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </nav>
              ))}

              {/* Contact Info */}
              <div className="text-stone-400">
                {footer.contact?.title && (
                  <Heading level="h2" size="sm" className="mb-4 text-white">
                    {footer.contact.title}
                  </Heading>
                )}
                {footer.contact && (
                  <address className="not-italic">
                    <div className="mb-2">
                      {footer.contact.address && <p>{footer.contact.address}</p>}
                      {footer.contact.city && (
                        <p>
                          {footer.contact.postalCode} {footer.contact.city}
                        </p>
                      )}
                    </div>
                    {footer.contact.phone && (
                      <p>
                        {t("footer.phone")}: {footer.contact.phone}
                      </p>
                    )}
                    {footer.contact.email && <p>{footer.contact.email}</p>}
                  </address>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="textone mt-12 border-t border-stone-700 pt-8 text-center text-stone-400">
          {footer.copyright && (
            <p>
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
