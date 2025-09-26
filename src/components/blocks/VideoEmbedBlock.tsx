import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { VideoEmbedBlock as VideoEmbedBlockType } from "@/payload-types";
import { YouTubeEmbed } from "@next/third-parties/google";
import { useTranslations } from "next-intl";

type Props = {
  block: VideoEmbedBlockType;
  className?: string;
};

export function VideoEmbedBlock({ block, className }: Props) {
  const t = useTranslations("blocks.videoEmbed");

  return (
    <div className={cn("my-16", className)}>
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <figure className="mx-auto max-w-[720px]">
        <div className="relative aspect-video w-full">
          <YouTubeEmbed
            videoid={block.youtubeId}
            playlabel={`${t("watchVideo")}: ${block.alt ? `${block.alt}` : ""}`}
          />
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-stone-400">
            {block.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
