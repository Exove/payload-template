import RenderForm from "@/components/forms/RenderForm";
import type { FormBlock as FormBlockType } from "@/payload-types";
import config from "@payload-config";
import type { Form } from "@payloadcms/plugin-form-builder/types";
import { getPayload } from "payload";
import type { NodeTypes } from "../BlockRenderer";
import { BlockRenderer } from "../BlockRenderer";

type Props = {
  block: FormBlockType;
};

export const FormBlock = async ({ block }: Props) => {
  const formId =
    typeof block.form === "object" ? (block.form as { id?: string | number })?.id : block.form;

  let initialForm: Form | null = null;
  if (formId) {
    try {
      const payload = await getPayload({ config });
      initialForm = (await payload.findByID({
        collection: "forms",
        id: formId,
      })) as unknown as Form;
    } catch {
      initialForm = null;
    }
  }

  return (
    <section>
      {block.enableIntro && block.introContent ? (
        <div className="prose max-w-none">
          <BlockRenderer nodes={block.introContent?.root?.children as unknown as NodeTypes[]} />
        </div>
      ) : null}

      {formId ? <RenderForm initialForm={initialForm} /> : null}
    </section>
  );
};

export default FormBlock;
