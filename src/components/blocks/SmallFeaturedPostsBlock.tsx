import Card from "@/components/Card";
import Heading from "@/components/Heading";
import { parseLink } from "@/lib/parse-link";
import { cn } from "@/lib/utils";
import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";

type Props = {
  block: SmallFeaturedPostsWrapperBlockType;
  className?: string;
};

export default function SmallFeaturedPostsBlock({ block, className }: Props) {
  return (
    <div className={cn("my-24 w-full", className)}>
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {block.posts.map((post) => {
          const { linkUrl } = parseLink(post.link);
          if (linkUrl) {
            return (
              <li key={post.id}>
                <Card
                  image={typeof post.image === "object" ? post.image : undefined}
                  title={post.title}
                  href={linkUrl}
                />
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
