import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { cn } from "@/lib/utils";
import { LargeFeaturedPostBlock as LargeFeaturedPostBlockType } from "@/payload-types";
import Image from "next/image";

type Props = {
  block: LargeFeaturedPostBlockType;
  className?: string;
};

export function LargeFeaturedPostBlock({ block, className }: Props) {
  const { linkUrl, linkLabel } = parseLink(block.link);

  return (
    <div
      className={cn(
        "my-24 grid overflow-hidden rounded-xl bg-stone-800 text-center sm:grid-cols-2",
        block.image ? "min-h-[350px] sm:grid-cols-2" : "sm:grid-cols-1",
        className,
      )}
    >
      {typeof block.image === "object" && block.image?.url && (
        <div className="relative min-h-[250px] sm:min-h-0">
          <Image
            src={block.image.url}
            alt={block.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
            style={{ objectPosition: `${block.image.focalX}% ${block.image.focalY}%` }}
            priority
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col justify-center p-10",
          !block.image && "mx-auto max-w-[800px] pt-14",
        )}
      >
        <Heading level="h2" size="lg">
          {block.title}
        </Heading>
        <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>
        {linkUrl && (
          <div className="mt-10 flex justify-center">
            <Button asChild={true}>
              <Link href={linkUrl}>{linkLabel || "Read more"}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
