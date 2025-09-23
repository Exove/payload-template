import { TabsBlock as TabsBlockType } from "@/payload-types";
import { useId } from "react";
import { BlockRenderer, NodeTypes } from "../BlockRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";

type TabsProps = {
  block: TabsBlockType;
};

export function TabsBlock({ block }: TabsProps) {
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
    <div className="w-full">
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
