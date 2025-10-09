import { InternalLink, LinkType, MenuItem } from "../types/menu";

type ParsedLink = {
  linkUrl?: string;
  linkLabel?: string;
  isExternal?: boolean;
};

export function parseInternalUrl(link?: InternalLink | null) {
  if (!link) return undefined;
  if (typeof link.value === "object" && "slug" in link.value) {
    return `/${link.relationTo}/${link.value.slug}`;
  }
}

export function parseExternalUrl(link?: string | null) {
  if (!link) return undefined;
  if (typeof link === "string") return link;
}

export function parseUrl(link?: LinkType | null) {
  if (!link) return undefined;
  if (link.internalUrl && !link.isExternal) return parseInternalUrl(link.internalUrl);
  if (link.externalUrl && link.isExternal) return parseExternalUrl(link.externalUrl);
}

export function parseLabel(link?: LinkType | null) {
  if (!link) return undefined;
  if (link.internalUrl && typeof link.internalUrl.value === "object")
    return link.label && link.label !== "" ? link.label : link.internalUrl.value.title;
  if (link.externalUrl) return link.label && link.label !== "" ? link.label : link.externalUrl;
}

export function isExternalLink(link?: LinkType | null): boolean {
  if (!link) return false;
  return link.isExternal === true || (link.externalUrl !== undefined && link.externalUrl !== null);
}

export function parseLink(link?: LinkType | null): ParsedLink {
  return {
    linkUrl: parseUrl(link),
    linkLabel: parseLabel(link),
    isExternal: isExternalLink(link),
  };
}

export function parseMenuLinks(menuItem?: MenuItem): ParsedLink {
  if (!menuItem) return {};
  return {
    linkUrl: parseUrl(menuItem.link),
    linkLabel: menuItem.label,
    isExternal: isExternalLink(menuItem.link),
  };
}
