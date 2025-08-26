"use client";

import { Link } from "@/i18n/routing";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

type CollectionPageItem = {
  id: number;
  title: string;
  slug: string;
  subPages?: { id: number; title: string; slug: string }[];
};

export default function SimpleMenu({
  items,
  locale,
}: {
  items: CollectionPageItem[];
  locale: "fi" | "en";
}) {
  if (!items || !items.length) return null;

  return (
    <nav>
      <ul className="flex items-center justify-center gap-4">
        {items.map((item) => {
          const hasSub = item.subPages && item.subPages.length > 0;
          if (hasSub) {
            return (
              <li key={item.id}>
                <Popover className="relative px-3 py-2">
                  <PopoverButton className="main-nav-item group flex items-center font-medium focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-amber-500">
                    <span className="transition-colors duration-200 group-data-[open]:text-amber-500">
                      {item.title}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover:text-amber-500 group-data-[open]:rotate-180 group-data-[open]:text-amber-500" />
                  </PopoverButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute left-1/2 z-20 mt-3 -translate-x-1/2 transform px-2">
                      <ul className="min-w-[220px] overflow-hidden rounded-lg border border-stone-700 bg-stone-800 p-3 shadow-lg ring-1 ring-black ring-opacity-5">
                        {item.subPages?.map((sp) => (
                          <li key={sp.id}>
                            <Link
                              href={`/articles/${sp.slug}`}
                              className="block px-3 py-2 leading-snug transition duration-150 ease-in-out hover:text-amber-500"
                            >
                              {sp.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </PopoverPanel>
                  </Transition>
                </Popover>
              </li>
            );
          }
          return (
            <li key={item.id}>
              <Link
                href={`/${locale}/${item.slug}`}
                className="px-3 py-2 text-base font-medium transition-colors hover:text-amber-500"
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
