"use client";

import { Button } from "@/components/forms/Button";
import { Checkbox } from "@/components/forms/Checkbox";
import { Input } from "@/components/forms/Input";
import { Label } from "@/components/forms/Label";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import type {
  CheckboxField,
  CountryField,
  EmailField,
  Form,
  FormFieldBlock,
  RadioField,
  SelectField,
  StateField,
  SubmissionValue,
  TextAreaField,
  TextField,
} from "@payloadcms/plugin-form-builder/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formId: string | number;
};

async function fetchForm(formId: string | number): Promise<Form | null> {
  try {
    const res = await fetch(`/api/forms/${formId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Form;
    return data;
  } catch {
    return null;
  }
}

function buildInitial(fields: FormFieldBlock[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  fields.forEach((f) => {
    if (
      "name" in f &&
      "defaultValue" in f &&
      typeof (f as { defaultValue?: unknown }).defaultValue !== "undefined"
    ) {
      defaults[(f as { name: string }).name] = (f as { defaultValue: unknown }).defaultValue;
    }
  });
  return defaults;
}

async function submitForm(values: Record<string, unknown>, form: Form) {
  const submissionData: SubmissionValue[] = Object.entries(values).map(([field, value]) => ({
    field,
    value,
  }));

  await fetch(`/api/form-submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form: form.id, submissionData }),
  });
}

export const RenderForm: React.FC<Props> = ({ formId }) => {
  const [form, setForm] = React.useState<Form | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const router = useRouter();

  const formMethods = useForm<Record<string, unknown>>({
    defaultValues: {},
  });
  const { register, handleSubmit, reset } = formMethods;

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    fetchForm(formId)
      .then((f) => {
        if (!active) return;
        setForm(f);
        if (f?.fields) {
          reset(buildInitial(f.fields));
        }
      })
      .catch(() => setError("Failed to load form"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [formId, reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!form) return;
    try {
      setSubmitting(true);
      await submitForm(data, form);
      setSubmitted(true);
      if (form.confirmationType === "redirect" && form.redirect?.url) {
        router.push(form.redirect.url);
      }
    } finally {
      setSubmitting(false);
    }
  };

  type Renderer = (f: FormFieldBlock) => React.ReactNode;
  const renderers: Partial<Record<FormFieldBlock["blockType"], Renderer>> = {
    text: (f: FormFieldBlock) => {
      const tf = f as TextField;
      return (
        <div key={tf.name}>
          {tf.label ? <Label htmlFor={tf.name}>{tf.label}</Label> : null}
          <Input
            id={tf.name}
            {...register(tf.name, { required: tf.required })}
            placeholder={(tf as { placeholder?: string }).placeholder}
          />
        </div>
      );
    },
    email: (f: FormFieldBlock) => {
      const ef = f as EmailField;
      return (
        <div key={ef.name}>
          {ef.label ? <Label htmlFor={ef.name}>{ef.label}</Label> : null}
          <Input
            id={ef.name}
            type="email"
            {...register(ef.name, { required: ef.required })}
            placeholder={(ef as { placeholder?: string }).placeholder}
          />
        </div>
      );
    },
    textarea: (f: FormFieldBlock) => {
      const tf = f as TextAreaField;
      return (
        <div key={tf.name}>
          {tf.label ? <Label htmlFor={tf.name}>{tf.label}</Label> : null}
          <Textarea
            id={tf.name}
            {...register(tf.name, { required: tf.required })}
            placeholder={(tf as { placeholder?: string }).placeholder}
          />
        </div>
      );
    },
    select: (f: FormFieldBlock) => {
      const sf = f as SelectField;
      return (
        <div key={sf.name}>
          {sf.label ? <Label htmlFor={sf.name}>{sf.label}</Label> : null}
          <Select id={sf.name} {...register(sf.name, { required: sf.required })} defaultValue="">
            <option value="" disabled>
              {sf.placeholder || "Select"}
            </option>
            {sf.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      );
    },
    radio: (f: FormFieldBlock) => {
      const rf = f as RadioField;
      return (
        <fieldset key={rf.name}>
          {rf.label ? (
            <legend className="mb-2 text-sm font-medium text-gray-900">{rf.label}</legend>
          ) : null}
          <div className="space-y-2">
            {rf.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value={opt.value}
                  {...register(rf.name, { required: rf.required })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      );
    },
    checkbox: (f: FormFieldBlock) => {
      const cf = f as CheckboxField;
      return (
        <div key={cf.name} className="flex items-center gap-2">
          <Checkbox id={cf.name} {...register(cf.name)} />
          {cf.label ? (
            <Label htmlFor={cf.name} className="!mb-0">
              {cf.label}
            </Label>
          ) : null}
        </div>
      );
    },
    country: (f: FormFieldBlock) => {
      const cf = f as CountryField;
      return (
        <div key={cf.name}>
          {cf.label ? <Label htmlFor={cf.name}>{cf.label}</Label> : null}
          <Select id={cf.name} {...register(cf.name, { required: cf.required })} defaultValue="">
            <option value="" disabled>
              {(cf as { placeholder?: string }).placeholder || "Select"}
            </option>
            {(cf as { options?: { label: string; value: string }[] }).options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      );
    },
    state: (f: FormFieldBlock) => {
      const sf = f as StateField;
      return (
        <div key={sf.name}>
          {sf.label ? <Label htmlFor={sf.name}>{sf.label}</Label> : null}
          <Select id={sf.name} {...register(sf.name, { required: sf.required })} defaultValue="">
            <option value="" disabled>
              {(sf as { placeholder?: string }).placeholder || "Select"}
            </option>
            {(sf as { options?: { label: string; value: string }[] }).options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      );
    },
    message: () => <div className="prose max-w-none" />,
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!form) return null;

  if (submitted) {
    if (form.confirmationType === "message") return <div>Thank you!</div>;
    if (form.confirmationType === "redirect" && form.redirect?.url) return null;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {form.fields?.map((f, i) => renderers[f.blockType]?.(f) ?? <div key={i} />)}
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : form.submitButtonLabel || "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default RenderForm;
