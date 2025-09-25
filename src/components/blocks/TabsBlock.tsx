import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { cn } from "@/lib/utils";
import { TabsBlock as TabsBlockType } from "@/payload-types";
import { useId } from "react";

type TabsProps = {
  block: TabsBlockType;
  className?: string;
};

export function TabsBlock({ block, className }: TabsProps) {
  const { tabs } = block;
  const baseId = useId();

  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Generate unique IDs for each tab
  const tabsWithIds = tabs.map((tab, index) => ({
    ...tab,
    id: `${baseId}-tab-${index}`,
  }));

  // Always use the first tab as default
  const defaultTab = tabsWithIds[0]?.id;

  return (
    <div className={cn("my-8", className)}>
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          {tabsWithIds.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabsWithIds.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content && <BlockRenderer nodes={tab.content.root.children as NodeTypes[]} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
