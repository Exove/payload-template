import { HeroBlock as HeroBlockType } from "@/payload-types";
import Image from "next/image";
import Heading from "../Heading";

type HeroProps = {
  block: HeroBlockType;
};

export function HeroBlock({ block }: HeroProps) {
  const { title, image } = block;

  return (
    <div className="relative mt-12 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-stone-950/40 py-32">
      {typeof image === "object" && image?.url && (
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image src={image.url} alt={image.alt || ""} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        </div>
      )}
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <Heading level="h1" size="xl" className="mb-6 text-white">
          {title}
        </Heading>
      </div>
    </div>
  );
}
