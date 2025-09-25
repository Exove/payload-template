import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { cn } from "@/lib/utils";
import { RichTextBlock as RichTextBlockType } from "@/payload-types";

type Props = {
  block: RichTextBlockType;
  className?: string;
};

export function RichTextBlock({ block, className }: Props) {
  return (
    <div className={cn("mx-auto max-w-4xl py-8", className)}>
      <BlockRenderer nodes={block.content?.root?.children as NodeTypes[]} />
    </div>
  );
}
