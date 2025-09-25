import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { AccordionBlock as AccordionBlockType } from "@/payload-types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../Accordion";
import { BlockRenderer, NodeTypes } from "../BlockRenderer";

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
      <ul>
        {items?.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.content && <BlockRenderer nodes={item.content.root?.children as NodeTypes[]} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </ul>
    </div>
  );
}
