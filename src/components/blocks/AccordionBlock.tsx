import { AccordionBlock as AccordionBlockType } from "@/payload-types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../Accordion";
import { BlockRenderer, NodeTypes } from "../BlockRenderer";

type AccordionProps = {
  block: AccordionBlockType;
};

export function AccordionBlock({ block }: AccordionProps) {
  const { items } = block;

  return (
    <ul className="space-y-4">
      {items?.map((item, index) => (
        <AccordionItem key={index}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            {item.content && <BlockRenderer nodes={item.content.root.children as NodeTypes[]} />}
          </AccordionContent>
        </AccordionItem>
      ))}
    </ul>
  );
}
