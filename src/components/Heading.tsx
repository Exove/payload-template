"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";
export type HeadingProps = {
  level: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  children: string;
  className?: string;
};

export default function Heading({ level, size = "md", children, className }: HeadingProps) {
  const Tag = level;
  const idBase = useId();

  if (!children) {
    return null;
  }

  // Create id from the text
  const id =
    children
      .toLowerCase()
      .replace(/\u00e4/g, "a")
      .replace(/\u00f6/g, "o")
      .replace(/\W/g, "-") +
    "-" +
    idBase;

  return (
    <Tag
      className={cn(
        size === "xl" && "mb-10 text-5xl font-bold",
        size === "lg" && "mb-8 text-4xl font-bold",
        size === "md" && "mb-6 text-2xl font-semibold",
        size === "sm" && "mb-4 text-xl font-semibold",
        size === "xs" && "mb-4 text-base font-medium",
        className,
      )}
      id={id}
    >
      {children}
    </Tag>
  );
}
