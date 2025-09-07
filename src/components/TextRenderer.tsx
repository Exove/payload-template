import { Link } from "@/i18n/routing";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "@/lib/node-format";
import { cn } from "@/lib/utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { SerializedTextNode } from "@payloadcms/richtext-lexical";
import type {
  SerializedElementNode,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";
import { Fragment } from "react";
import Heading from "./Heading";

type HeadingNode = SerializedElementNode & {
  tag: "h1" | "h2" | "h3" | "h4";
};

type ListNode = SerializedElementNode & {
  tag: "ul" | "ol";
  listType?: string;
};

type ListItemNode = SerializedElementNode & {
  checked?: boolean;
  value?: number;
};

type LinkNode = SerializedElementNode & {
  fields: {
    doc?: {
      relationTo: string;
      value: {
        id: number;
        title: string;
        slug: string;
      };
    };
    url?: string;
    newTab?: boolean;
    linkType?: "custom" | "internal";
  };
};

type NodeRendererProps = {
  node: SerializedElementNode | SerializedTextNode;
  index: number;
  className?: string;
};

export function TextRenderer({ node, index, className }: NodeRendererProps) {
  if (!node) return null;

  const renderChildren = (node: SerializedElementNode) => {
    if (!node.children) return null;
    return node.children.map((child: SerializedLexicalNode, i: number) => (
      <TextRenderer
        key={`${index}-${i}`}
        node={child as SerializedElementNode}
        index={i}
        className={className}
      />
    ));
  };

  switch (node.type) {
    case "root": {
      const children = renderChildren(node as SerializedElementNode);
      if (!children) return null;
      return <Fragment key={index}>{children}</Fragment>;
    }
    case "text": {
      const textNode = node as unknown as SerializedTextNode;
      if (!textNode.text) return null;
      const content = <Fragment key={index}>{textNode.text}</Fragment>;

      switch (textNode.format) {
        case IS_BOLD:
          return <strong key={index}>{content}</strong>;
        case IS_ITALIC:
          return <em key={index}>{content}</em>;
        case IS_STRIKETHROUGH:
          return (
            <span key={index} style={{ textDecoration: "line-through" }}>
              {content}
            </span>
          );
        case IS_UNDERLINE:
          return (
            <span key={index} style={{ textDecoration: "underline" }}>
              {content}
            </span>
          );
        case IS_CODE:
          return <code key={index}>{content}</code>;
        case IS_SUBSCRIPT:
          return <sub key={index}>{content}</sub>;
        case IS_SUPERSCRIPT:
          return <sup key={index}>{content}</sup>;
        default:
          return content;
      }
    }
    case "paragraph":
      const children = renderChildren(node);
      // If there are no children, return null to avoid rendering an empty paragraph
      if (!children || (Array.isArray(children) && children.every((child) => !child))) return null;
      return (
        <p className={cn(`mx-auto mb-4 max-w-prose leading-relaxed`, className)} key={index}>
          {children}
        </p>
      );
    case "heading": {
      const headingNode = node as HeadingNode;
      const headingText = node.children
        ?.map((child) => (child as SerializedTextNode).text)
        .join("");
      return (
        <div className={cn("mx-auto mt-8 max-w-prose", className)}>
          {headingNode.tag === "h2" && (
            <Heading level={headingNode.tag} size="md">
              {headingText}
            </Heading>
          )}
          {headingNode.tag === "h3" && (
            <Heading level={headingNode.tag} size="sm">
              {headingText}
            </Heading>
          )}
        </div>
      );
    }
    case "list": {
      const listNode = node as ListNode;
      const Tag = listNode.tag;
      return (
        <Tag className={cn("list col-start-2", className)} key={index}>
          {renderChildren(node)}
        </Tag>
      );
    }
    case "listitem": {
      const listItemNode = node as ListItemNode;
      if (listItemNode.checked != null) {
        return (
          <li
            aria-checked={listItemNode.checked ? "true" : "false"}
            className={listItemNode.checked ? "" : ""}
            key={index}
            role="checkbox"
            tabIndex={-1}
            value={listItemNode.value}
          >
            {renderChildren(node)}
          </li>
        );
      }
      return (
        <li key={index} value={listItemNode.value}>
          {renderChildren(node)}
        </li>
      );
    }
    case "quote":
      return (
        <blockquote className={cn("col-start-2", className)} key={index}>
          {renderChildren(node)}
        </blockquote>
      );
    case "link": {
      const linkNode = node as LinkNode;
      const { doc, url, newTab, linkType } = linkNode.fields;

      const href =
        linkType === "custom" ? url || "/" : doc ? `/${doc.relationTo}/${doc.value.slug}` : "/";
      const target = newTab ? "_blank" : undefined;
      const rel = newTab ? "noopener noreferrer" : undefined;

      return (
        <Link
          href={href}
          key={index}
          className={cn(
            "font-medium underline decoration-amber-500 underline-offset-2 hover:text-amber-500",
            className,
          )}
          target={target}
          rel={rel}
        >
          {renderChildren(node)}
          {url && <ArrowTopRightOnSquareIcon className="ml-1 inline h-4 w-4" />}
        </Link>
      );
    }
    case "linebreak":
      return <br className={cn("col-start-2", className)} key={index} />;
    default:
      return null;
  }
}
