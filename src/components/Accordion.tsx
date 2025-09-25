import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export function AccordionItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <details className="group">{children}</details>
    </li>
  );
}

export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  return (
    <summary
      role="button"
      className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-stone-600 py-5 text-base font-medium leading-tight hover:underline group-open:border-transparent"
    >
      <div>{children}</div>
      <div className="relative h-6 w-6 shrink-0">
        <PlusIcon className="absolute h-6 w-6 stroke-2 text-amber-500 transition-opacity duration-200 group-open:opacity-0" />
        <MinusIcon className="absolute h-6 w-6 stroke-2 text-amber-500 opacity-0 transition-opacity duration-200 group-open:opacity-100" />
      </div>
    </summary>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden border-b border-transparent px-0 py-4 text-stone-400 group-open:border-stone-600">
      {children}
    </div>
  );
}
