"use client";

import RenderForm from "@/components/forms/RenderForm";
import type { FormBlock as FormBlockType } from "@/payload-types";
import type { NodeTypes } from "../BlockRenderer";
import { BlockRenderer } from "../BlockRenderer";

type Props = {
  block: FormBlockType;
};

export const FormBlock = ({ block }: Props) => {
  const formId =
    typeof block.form === "object" ? (block.form as { id?: string | number })?.id : block.form;

  return (
    <section>
      {block.enableIntro && block.introContent ? (
        <div className="prose max-w-none">
          <BlockRenderer nodes={block.introContent?.root?.children as unknown as NodeTypes[]} />
        </div>
      ) : null}

      {formId ? <RenderForm formId={formId as string | number} /> : null}
    </section>
  );
};

export default FormBlock;
