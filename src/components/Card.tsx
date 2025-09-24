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
      <div className="relative h-64 w-full">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
            style={{ objectPosition: `${image.focalX}% ${image.focalY}%` }}
          />
        ) : (
          // Empty image placeholder
          <div className="flex h-full w-full items-center justify-center bg-stone-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-12 w-12 text-stone-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </div>
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
