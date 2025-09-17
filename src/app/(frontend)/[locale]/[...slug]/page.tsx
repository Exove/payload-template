import { notFound } from "next/navigation";

// This is a catch-all page for all routes that are not found.

export default function CatchAllNotFoundPage() {
  notFound();
}
