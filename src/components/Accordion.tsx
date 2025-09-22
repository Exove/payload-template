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
      className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 border-b border-purple-600 px-8 py-6 text-base font-bold leading-tight hover:underline group-open:bg-stone-800"
    >
      <div>{children}</div>
      <div className="relative h-6 w-6 shrink-0">
        <PlusIcon className="absolute h-6 w-6 stroke-2 text-purple-600 transition-opacity duration-200 group-open:opacity-0" />
        <MinusIcon className="absolute h-6 w-6 stroke-2 text-purple-600 opacity-0 transition-opacity duration-200 group-open:opacity-100" />
      </div>
    </summary>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden px-8 py-8">{children}</div>;
}
