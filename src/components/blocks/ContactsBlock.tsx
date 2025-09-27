import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { ContactsBlock as ContactsBlockType } from "@/payload-types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {
  block: ContactsBlockType;
  className?: string;
  context?: "article" | "frontpage";
};

export function ContactsBlock({ block, className, context = "frontpage" }: Props) {
  return (
    <div className={cn(context === "article" ? "mb-8 mt-16" : "my-24", className)}>
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <div
        className={cn(
          "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
          context === "article" && "lg:grid-cols-2",
        )}
      >
        {block.contacts?.map(
          (contact) =>
            typeof contact === "object" && (
              <div key={contact.id} className="relative rounded-xl bg-stone-800 p-6">
                <div className="relative mb-4 h-48 w-full overflow-hidden">
                  {typeof contact.image === "object" && contact.image?.url ? (
                    <Image
                      src={contact.image.url}
                      alt={contact.image.alt || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                      style={{
                        objectPosition: `${contact.image.focalX}% ${contact.image.focalY}%`,
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-700">
                      <UserCircleIcon className="h-14 w-14 text-stone-500" />
                    </div>
                  )}
                </div>
                <Heading level="h3" size="sm" className="mb-1 text-stone-400">
                  {contact.name}
                </Heading>
                {contact.title && (
                  <p className="mb-3 text-sm font-medium text-stone-400">{contact.title}</p>
                )}
                <div className="mt-4 space-y-2">
                  <p className="flex items-center text-stone-300">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-stone-300 hover:text-amber-500"
                    >
                      {contact.email}
                    </a>
                  </p>
                  {contact.phone && (
                    <p className="flex items-center text-stone-300">
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-sm text-stone-300 hover:text-amber-500"
                      >
                        {contact.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
