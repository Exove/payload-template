"use client";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/forms/Checkbox";
import { FormErrorMessage } from "@/components/forms/FormErrorMessage";
import { Input } from "@/components/forms/Input";
import { Label } from "@/components/forms/Label";
import { Legend } from "@/components/forms/Legend";
import { Radio } from "@/components/forms/Radio";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import type {
  CheckboxField,
  DateField,
  EmailField,
  Form,
  FormFieldBlock,
  MessageField,
  RadioField,
  SelectField,
  SubmissionValue,
  TextAreaField,
  TextField,
} from "@payloadcms/plugin-form-builder/types";
import type { SerializedElementNode } from "@payloadcms/richtext-lexical/lexical";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { TextRenderer } from "../TextRenderer";

type Props = {
  initialForm?: Form | null;
};

function toDateInputValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (value.includes("T")) return value.split("T")[0];
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return "";
}

function buildInitial(fields: FormFieldBlock[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  fields.forEach((field) => {
    if (
      "name" in field &&
      "defaultValue" in field &&
      typeof (field as { defaultValue?: unknown }).defaultValue !== "undefined"
    ) {
      let value = (field as { defaultValue: unknown }).defaultValue;
      if ((field as { blockType?: string }).blockType === "date") {
        value = toDateInputValue(value);
      }
      defaults[(field as { name: string }).name] = value;
    }
  });
  return defaults;
}

async function submitForm(values: Record<string, unknown>, form: Form) {
  // Check for null or undefined values and serialize them
  const serializeValue = (value: unknown): string => {
    if (value === null || typeof value === "undefined") return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return Number.isNaN(value) ? "" : String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const submissionData: SubmissionValue[] = Object.entries(values).map(([field, value]) => ({
    field,
    value: serializeValue(value),
  }));

  await fetch(`/api/form-submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form: form.id, submissionData }),
  });
}

export const RenderForm: React.FC<Props> = ({ initialForm }) => {
  const tFormErrors = useTranslations("forms.errors");
  const form = initialForm ?? null;
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const router = useRouter();

  const defaultValues = React.useMemo(() => {
    if (form?.fields) return buildInitial(form.fields);
    return {};
  }, [form]);

  const formMethods = useForm<Record<string, unknown>>({ defaultValues });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!form) return <div className="text-red-600">{tFormErrors("failedToLoadForm")}</div>;

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

  type Renderer = (field: FormFieldBlock) => React.ReactNode;
  type ExtendedBlockType = FormFieldBlock["blockType"] | "number";
  const renderers: Partial<Record<ExtendedBlockType, Renderer>> = {
    text: (field: FormFieldBlock) => {
      const textField = field as TextField;
      const fieldName = textField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={textField.name}>
          {textField.label ? <Label htmlFor={textField.name}>{textField.label}</Label> : null}
          <Input
            id={textField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(textField.name, {
              required: textField.required ? tFormErrors("fieldRequired") : false,
            })}
            placeholder={(textField as { placeholder?: string }).placeholder}
          />
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    number: (field: FormFieldBlock) => {
      const numberField = field as EmailField; // Shares the same type as the EmailField
      const fieldName = numberField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={numberField.name}>
          {numberField.label ? <Label htmlFor={numberField.name}>{numberField.label}</Label> : null}
          <Input
            id={numberField.name}
            type="number"
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(numberField.name, {
              required: numberField.required ? tFormErrors("fieldRequired") : false,
            })}
          />
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    email: (field: FormFieldBlock) => {
      const emailField = field as EmailField;
      const fieldName = emailField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={emailField.name}>
          {emailField.label ? <Label htmlFor={emailField.name}>{emailField.label}</Label> : null}
          <Input
            id={emailField.name}
            type="email"
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(emailField.name, {
              required: emailField.required ? tFormErrors("fieldRequired") : false,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: tFormErrors("emailInvalid"),
              },
            })}
            placeholder={(emailField as { placeholder?: string }).placeholder}
          />
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    textarea: (field: FormFieldBlock) => {
      const textareaField = field as TextAreaField;
      const fieldName = textareaField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={textareaField.name}>
          {textareaField.label ? (
            <Label htmlFor={textareaField.name}>{textareaField.label}</Label>
          ) : null}
          <Textarea
            id={textareaField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(textareaField.name, {
              required: textareaField.required ? tFormErrors("fieldRequired") : false,
            })}
            placeholder={(textareaField as { placeholder?: string }).placeholder}
          />
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    select: (field: FormFieldBlock) => {
      const selectField = field as SelectField;
      const fieldName = selectField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={selectField.name}>
          {selectField.label ? <Label htmlFor={selectField.name}>{selectField.label}</Label> : null}
          <Select
            id={selectField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(selectField.name, {
              required: selectField.required ? tFormErrors("selectOption") : false,
            })}
            defaultValue=""
          >
            <option value="" disabled>
              {selectField.placeholder || "Select"}
            </option>
            {selectField.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    radio: (field: FormFieldBlock) => {
      const radioField = field as RadioField;
      const fieldName = radioField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <fieldset
          key={radioField.name}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
        >
          {radioField.label ? <Legend>{radioField.label}</Legend> : null}
          <div className="space-y-2" role="radiogroup">
            {radioField.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Radio
                  id={`${radioField.name}-${option.value}`}
                  value={option.value}
                  aria-describedby={error ? errorId : undefined}
                  {...register(radioField.name, {
                    required: radioField.required ? tFormErrors("selectOption") : false,
                  })}
                />
                {option.label ? (
                  <Label htmlFor={`${radioField.name}-${option.value}`} className="mb-0">
                    {option.label}
                  </Label>
                ) : null}
              </div>
            ))}
          </div>
          <FormErrorMessage id={errorId} message={error?.message} />
        </fieldset>
      );
    },
    checkbox: (field: FormFieldBlock) => {
      const checkboxField = field as CheckboxField;
      const fieldName = checkboxField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={checkboxField.name}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={checkboxField.name}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? errorId : undefined}
              {...register(checkboxField.name, {
                required: checkboxField.required ? tFormErrors("checkboxRequired") : false,
              })}
            />
            {checkboxField.label ? (
              <Label htmlFor={checkboxField.name} className="!mb-0">
                {checkboxField.label}
              </Label>
            ) : null}
          </div>
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    date: (field: FormFieldBlock) => {
      const dateField = field as DateField;
      const fieldName = dateField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={dateField.name}>
          {dateField.label ? <Label htmlFor={dateField.name}>{dateField.label}</Label> : null}
          <Input
            id={dateField.name}
            type="date"
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(dateField.name, {
              required: dateField.required ? tFormErrors("fieldRequired") : false,
            })}
            placeholder={(dateField as { placeholder?: string }).placeholder}
          />
          <FormErrorMessage id={errorId} message={error?.message} />
        </div>
      );
    },
    message: (field: FormFieldBlock) => {
      const messageField = field as MessageField;
      const root = (messageField.message as unknown as { root?: SerializedElementNode })?.root;
      if (!root) return null;
      return <TextRenderer node={root} index={0} className="mb-0 max-w-none leading-normal" />;
    },
  };

  if (submitted) {
    if (form.confirmationType === "message")
      return <div>{form.confirmationMessage?.root?.children[0]?.value || "Thank you!"}</div>;
    if (form.confirmationType === "redirect" && form.redirect?.url) return null;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {form.fields?.map((field, index) => {
        const key =
          ("name" in field && (field as unknown as { name?: string }).name) ||
          (field as unknown as { id?: string }).id ||
          `${field.blockType}-${index}`;
        const element = renderers[field.blockType]?.(field) ?? <div />;
        const width = (field as { width?: number }).width ?? 100;
        return (
          <div key={key} style={{ width: `${width}%` }}>
            {element}
          </div>
        );
      })}
      <div>
        <Button type="submit" disabled={submitting} variant="secondary">
          {submitting ? "Submitting…" : form.submitButtonLabel || "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default RenderForm;
