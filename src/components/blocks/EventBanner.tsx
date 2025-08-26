import { Link } from "@/i18n/routing";
import { Event, FrontPage, Media } from "@/payload-types";
import Image from "next/image";

type FeaturedEventsItem = NonNullable<FrontPage["featuredEvents"]>[number];

type Props = {
  item: FeaturedEventsItem;
};

export default function EventBanner({ item }: Props) {
  const background =
    typeof item.backgroundImage === "object" ? (item.backgroundImage as Media) : undefined;
  const events = (item.event || [])
    .filter(Boolean)
    .map((e) => (typeof e === "object" ? (e as Event) : undefined))
    .filter(Boolean) as Event[];

  return (
    <div className="relative overflow-hidden rounded">
      {background?.url && (
        <div className="absolute inset-0">
          <Image
            src={background.sizes?.large?.url || background.url}
            alt={background.alt || ""}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}

      <div className="flex items-center justify-between px-8 py-12 sm:px-12 sm:py-16">
        <div className="flex items-baseline gap-20">
          {item.title && (
            <h2 className="font-medium text-white sm:text-4xl lg:text-3xl">{item.title}</h2>
          )}
          {item.description && <p className="text-lg">{item.description}</p>}
        </div>

        <div>
          {events.slice(0, 3).map((ev) => (
            <Link
              key={ev.id}
              href={`/events/${ev.slug}`}
              className="group relative block overflow-hidden rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
            >
              Lue lisää tapahtumasta
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
