import { QuoteBlock as QuoteBlockType } from "@/payload-types";
import Image from "next/image";

type Props = {
  block: QuoteBlockType;
};

export function QuoteBlock({ block }: Props) {
  return (
    <blockquote className="relative mx-auto max-w-3xl pt-12 sm:px-8">
      <span className="absolute left-4 top-0 font-serif text-7xl text-stone-600">&ldquo;</span>
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
