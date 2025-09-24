import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Media } from "@/payload-types";
import Image from "next/image";
import Heading from "./Heading";

export type CardProps = {
  image?: Media;
  title: string;
  text?: string | null;
  href: string;
  className?: string;
};

export default function Card({ image, title, text, href, className }: CardProps) {
  if (!href || !title) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-stone-800 transition-all duration-300 hover:ring-1 hover:ring-amber-500",
        className,
      )}
    >
      {image?.url && (
        <div className="relative h-64 w-full">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
            style={{ objectPosition: `${image.focalX}% ${image.focalY}%` }}
          />
        </div>
      )}
      <div className="p-6">
        <Link href={href} className="block">
          <span className="absolute inset-x-0 inset-y-0 z-10"></span>
          <Heading level="h2" size="sm" className="mb-2">
            {title}
          </Heading>
        </Link>
        {text && <p className="mb-4 line-clamp-2 text-stone-300">{text}</p>}
      </div>
    </div>
  );
}
