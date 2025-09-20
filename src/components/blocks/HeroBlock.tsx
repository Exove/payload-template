import Button from "@/components/Button";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { HeroBlock as HeroBlockType } from "@/payload-types";
import Image from "next/image";
import Heading from "../Heading";

type HeroProps = {
  block: HeroBlockType;
};

export function HeroBlock({ block }: HeroProps) {
  const { title, description, image, link } = block;
  const { linkUrl, linkLabel } = parseLink(link);

  return (
    <div className="relative mt-12 flex w-full items-center justify-center overflow-hidden rounded-2xl py-32">
      <div className="absolute inset-0">
        {typeof image === "object" && image.url && (
          <div className="relative h-full w-full">
            <Image src={image.url} alt={image.alt || ""} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <Heading level="h1" size="xl" className="mb-6 text-white">
          {title}
        </Heading>
        <p className="mb-8 text-lg leading-relaxed text-stone-100">{description}</p>
        <div className="flex justify-center">
          {linkUrl && linkLabel && (
            <Button asChild={true}>
              <Link href={linkUrl}>{linkLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
