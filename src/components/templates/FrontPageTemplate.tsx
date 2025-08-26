import { BlockRenderer } from "@/components/BlockRenderer";
import EventBanner from "@/components/blocks/EventBanner";
import { FrontPage } from "@/payload-types";

type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  return (
    <main id="main-content">
      {content.hero && <BlockRenderer blocks={content.hero} />}
      {Array.isArray(content.featuredEvents) && content.featuredEvents.length > 0 && (
        <div className="my-8">
          {content.featuredEvents.map((item) => (
            <EventBanner key={item.id} item={item} />
          ))}
        </div>
      )}
      <div className="mx-auto max-w-screen-lg py-16">
        {content.content && <BlockRenderer blocks={content.content} />}
      </div>
    </main>
  );
}
