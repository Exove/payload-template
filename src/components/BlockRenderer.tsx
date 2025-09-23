import type {
  AccordionBlock as AccordionBlockType,
  ContactsBlock as ContactsBlockType,
  DynamicListBlock as DynamicListBlockType,
  HeroBlock as HeroBlockType,
  LargeFeaturedPostBlock as LargeFeaturedPostBlockType,
  LinkListBlock as LinkListBlockType,
  MediaBlock as MediaBlockType,
  QuoteBlock as QuoteBlockType,
  SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType,
  TabsBlock as TabsBlockType,
  VideoEmbedBlock as VideoEmbedBlockType,
} from "@/payload-types";
import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { AccordionBlock } from "./blocks/AccordionBlock";
import { ContactsBlock } from "./blocks/ContactsBlock";
import DynamicListBlock from "./blocks/DynamicListBlock";
import { HeroBlock } from "./blocks/HeroBlock";
import { LargeFeaturedPostBlock } from "./blocks/LargeFeaturedPostBlock";
import { LinkListBlock } from "./blocks/LinkListBlock";
import { MediaBlock } from "./blocks/MediaBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import SmallFeaturedPostsBlock from "./blocks/SmallFeaturedPostsBlock";
import { TabsBlock } from "./blocks/TabsBlock";
import { VideoEmbedBlock } from "./blocks/VideoEmbedBlock";
import { TextRenderer } from "./TextRenderer";
type BaseBlockTypes =
  | AccordionBlockType
  | MediaBlockType
  | QuoteBlockType
  | VideoEmbedBlockType
  | LinkListBlockType
  | LargeFeaturedPostBlockType
  | SmallFeaturedPostsWrapperBlockType
  | ContactsBlockType
  | HeroBlockType
  | DynamicListBlockType
  | TabsBlockType;

export type NodeTypes = DefaultNodeTypes | SerializedBlockNode<BaseBlockTypes>;
type BlockTypes = BaseBlockTypes;

type Props = {
  nodes?: NodeTypes[];
  blocks?: BlockTypes[];
};

export const BlockRenderer = ({ nodes, blocks }: Props) => {
  if (!nodes && !blocks) return null;

  const renderBlock = (block: BaseBlockTypes) => {
    switch (block.blockType) {
      case "accordion":
        return <AccordionBlock key={block.id} block={block} />;
      case "media":
        return <MediaBlock key={block.id} block={block} />;
      case "quote":
        return <QuoteBlock key={block.id} block={block} />;
      case "tabs":
        return <TabsBlock key={block.id} block={block} />;
      case "videoEmbed":
        return <VideoEmbedBlock key={block.id} block={block} />;
      case "contacts":
        return <ContactsBlock key={block.id} block={block} />;
      case "linkList":
        return <LinkListBlock key={block.id} block={block} />;
      case "largeFeaturedPost":
        return <LargeFeaturedPostBlock key={block.id} block={block} />;
      case "smallFeaturedPostsWrapper":
        return <SmallFeaturedPostsBlock key={block.id} block={block} />;
      case "hero":
        return <HeroBlock key={block.id} block={block} />;
      case "dynamicList":
        return <DynamicListBlock key={block.id} block={block} />;
      default:
        return null;
    }
  };

  const renderNodes = (nodesToRender: NodeTypes[]) => {
    return nodesToRender.map((node, index) => {
      if (
        node.type === "text" ||
        node.type === "heading" ||
        node.type === "list" ||
        node.type === "listitem" ||
        node.type === "paragraph"
      ) {
        return <TextRenderer key={index} node={node} index={index} />;
      }

      if (node.type === "block" && node.fields) {
        return renderBlock(node.fields);
      }

      return null;
    });
  };

  const renderBlocks = (blocksToRender: BlockTypes[]) => {
    return blocksToRender.map(renderBlock);
  };

  if (nodes) return renderNodes(nodes);
  if (blocks) return renderBlocks(blocks);

  return null;
};
