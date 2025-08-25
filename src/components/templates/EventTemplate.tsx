import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { Link } from "@/i18n/routing";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Event } from "@/payload-types";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import Image from "next/image";
import Heading from "../Heading";
import ShareButtons from "../ShareButtons";

function formatDateTime(value: string | undefined, locale: string) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface EventTemplateProps {
  event: Event;
}

export default function EventTemplate({ event }: EventTemplateProps) {
  const locale = useLocale();

  return (
    <main id="main-content" className="mx-auto max-w-[800px] py-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400 hover:text-stone-300">
        <ChevronLeftIcon className="size-4 stroke-2" />
        <Link href="/events">Events</Link>
      </div>
      <Heading level="h1" size="lg" className="mb-6">
        {event.title}
      </Heading>
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-stone-400">
        {event.startDate && (
          <time dateTime={event.startDate}>{formatDateTime(event.startDate, locale)}</time>
        )}
        {event.endDate && (
          <>
            <span>–</span>
            <time dateTime={event.endDate}>{formatDateTime(event.endDate, locale)}</time>
          </>
        )}
        {event.location && (
          <>
            <span>•</span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {typeof event.image === "object" && event.image?.url && (
        <Image
          src={event.image.sizes?.large?.url || event.image.url}
          alt={event.image.alt || ""}
          width={1920}
          height={1080}
          className="mb-10 aspect-video w-full max-w-[800px] rounded-lg object-cover"
          priority
        />
      )}
      {event.registrationUrl && (
        <h2 className="mb-2 mt-20 text-2xl font-bold">Embedded registration form</h2>
      )}
      <div className="mx-auto max-w-screen-lg">
        <BlockRenderer nodes={event.content?.root?.children as NodeTypes[]} />
        {(() => {
          const rawUrl = event.registrationUrl?.trim();
          if (!rawUrl) return null;
          const isGoogleForm = rawUrl.includes("docs.google.com/forms");
          const shouldEmbed = rawUrl.startsWith("@") || isGoogleForm;
          if (!shouldEmbed) return null;
          const urlWithoutAt = rawUrl.startsWith("@") ? rawUrl.slice(1).trim() : rawUrl;
          const hasEmbeddedParam = /[?&]embedded=true(?![^#]*#)/.test(urlWithoutAt);
          const hasQuery = urlWithoutAt.includes("?");
          const embedSrc = hasEmbeddedParam
            ? urlWithoutAt
            : `${urlWithoutAt}${hasQuery ? "&" : "?"}embedded=true`;
          return (
            <div className="mt-6">
              <iframe
                src={embedSrc}
                className="h-[1200px] w-full rounded-lg border border-stone-600 bg-stone-800"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              >
                Loading…
              </iframe>
            </div>
          );
        })()}
        <div className="mx-auto mt-10 max-w-prose">
          <ShareButtons />
        </div>
      </div>
    </main>
  );
}

export function getEventOpenGraphImages(event: Event) {
  return prepareOpenGraphImages(event?.meta?.image);
}
