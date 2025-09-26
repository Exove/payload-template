import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { AccordionBlock as AccordionBlockType } from "@/payload-types";

type AccordionProps = {
  block: AccordionBlockType;
  className?: string;
};

export function AccordionBlock({ block, className }: AccordionProps) {
  const { items } = block;

  return (
    <div className={cn("my-12", className)}>
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-2">
          {block.blockName}
        </Heading>
      )}
      <Accordion type="multiple" className="w-full">
        {items?.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.content && <BlockRenderer nodes={item.content.root?.children as NodeTypes[]} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
