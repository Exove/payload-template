import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { CTABlock as CTABlockType } from "@/payload-types";
import Button from "../Button";
import Heading from "../Heading";

type Props = {
  block: CTABlockType;
};

export function CTABlock({ block }: Props) {
  const { linkUrl, linkLabel } = parseLink(block.link);
  return (
    <div className="mx-auto my-24 w-full rounded-xl bg-stone-800 p-10 text-center">
      <Heading level="h2" size="lg" className="mb-6">
        {block.title}
      </Heading>
      {block.text && <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>}
      {linkUrl && (
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild>
            <Link href={linkUrl}>{linkLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
