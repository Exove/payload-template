import { cn } from "@/lib/utils";
import { QuoteBlock as QuoteBlockType } from "@/payload-types";
import Image from "next/image";

type Props = {
  block: QuoteBlockType;
  className?: string;
};

export function QuoteBlock({ block, className }: Props) {
  return (
    <blockquote className={cn("relative mx-auto my-24 max-w-3xl pt-12 sm:px-8", className)}>
      <span className="absolute left-0 top-0 font-serif text-7xl text-stone-600 sm:left-4">
        &ldquo;
      </span>
      <p className="relative mb-6 font-serif text-2xl italic">{block.quote}</p>
      {block.author && (
        <footer className="text-stone-300">
          <cite className="flex items-center gap-4 not-italic">
            {typeof block.image !== "number" && block.image?.url && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={block.image.url || "/placeholder-img.png"}
                  alt={block.author}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{block.author}</span>
                {block.title && (
                  <>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400">{block.title}</span>
                  </>
                )}
              </div>
            </div>
          </cite>
        </footer>
      )}
    </blockquote>
  );
}
