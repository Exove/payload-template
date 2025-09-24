import { parseLink } from "@/lib/parse-link";
import { CarouselBlock as CarouselBlockType } from "@/payload-types";
import Card from "../Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../Carousel";
import Heading from "../Heading";

type Props = {
  block: CarouselBlockType;
};

export default function CarouselBlock({ block }: Props) {
  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-none"
      >
        {/* Mobile navigation buttons at the top */}
        <div className="mb-4 flex justify-center gap-4 md:hidden">
          <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0" />
          <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0" />
        </div>

        <CarouselContent className="-ml-2 md:-ml-4">
          {block.items.map((item) => {
            const { linkUrl } = parseLink(item.link);
            if (linkUrl) {
              return (
                <CarouselItem key={item.id} className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
                  <Card
                    image={typeof item.image === "object" ? item.image : undefined}
                    title={item.title}
                    text={item.text}
                    href={linkUrl}
                  />
                </CarouselItem>
              );
            }
            return null;
          })}
        </CarouselContent>

        {/* Desktop navigation buttons on the sides */}
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
