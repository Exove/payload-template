"use client";

import { Button } from "@/components/Button";
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
  fields.forEach((field) => {
    if (
      "name" in field &&
      "defaultValue" in field &&
      typeof (field as { defaultValue?: unknown }).defaultValue !== "undefined"
    ) {
      defaults[(field as { name: string }).name] = (
        field as { defaultValue: unknown }
      ).defaultValue;
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    fetchForm(formId)
      .then((form) => {
        if (!active) return;
        setForm(form);
        if (form?.fields) {
          reset(buildInitial(form.fields));
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

  type Renderer = (field: FormFieldBlock) => React.ReactNode;
  const renderers: Partial<Record<FormFieldBlock["blockType"], Renderer>> = {
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
              required: textField.required ? "This field is required" : false,
            })}
            placeholder={(textField as { placeholder?: string }).placeholder}
          />
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
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
              required: emailField.required ? "This field is required" : false,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            placeholder={(emailField as { placeholder?: string }).placeholder}
          />
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
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
              required: textareaField.required ? "This field is required" : false,
            })}
            placeholder={(textareaField as { placeholder?: string }).placeholder}
          />
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
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
              required: selectField.required ? "Please select an option" : false,
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
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
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
          {radioField.label ? (
            <legend className="mb-2 text-sm font-medium text-gray-900">{radioField.label}</legend>
          ) : null}
          <div className="space-y-2">
            {radioField.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value={option.value}
                  aria-describedby={error ? errorId : undefined}
                  {...register(radioField.name, {
                    required: radioField.required ? "Please select an option" : false,
                  })}
                />
                {option.label}
              </label>
            ))}
          </div>
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
        </fieldset>
      );
    },
    checkbox: (field: FormFieldBlock) => {
      const checkboxField = field as CheckboxField;
      const fieldName = checkboxField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={checkboxField.name} className="flex items-center gap-2">
          <Checkbox
            id={checkboxField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(checkboxField.name, {
              required: checkboxField.required ? "This field must be checked" : false,
            })}
          />
          {checkboxField.label ? (
            <Label htmlFor={checkboxField.name} className="!mb-0">
              {checkboxField.label}
            </Label>
          ) : null}
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
        </div>
      );
    },
    country: (field: FormFieldBlock) => {
      const countryField = field as CountryField;
      const fieldName = countryField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={countryField.name}>
          {countryField.label ? (
            <Label htmlFor={countryField.name}>{countryField.label}</Label>
          ) : null}
          <Select
            id={countryField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(countryField.name, {
              required: countryField.required ? "Please select a country" : false,
            })}
            defaultValue=""
          >
            <option value="" disabled>
              {(countryField as { placeholder?: string }).placeholder || "Select"}
            </option>
            {(countryField as { options?: { label: string; value: string }[] }).options?.map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </Select>
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
        </div>
      );
    },
    state: (field: FormFieldBlock) => {
      const stateField = field as StateField;
      const fieldName = stateField.name;
      const error = (errors as Record<string, { message?: string }>)[fieldName];
      const errorId = `${fieldName}-error`;
      return (
        <div key={stateField.name}>
          {stateField.label ? <Label htmlFor={stateField.name}>{stateField.label}</Label> : null}
          <Select
            id={stateField.name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            {...register(stateField.name, {
              required: stateField.required ? "Please select a state" : false,
            })}
            defaultValue=""
          >
            <option value="" disabled>
              {(stateField as { placeholder?: string }).placeholder || "Select"}
            </option>
            {(stateField as { options?: { label: string; value: string }[] }).options?.map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </Select>
          {error?.message ? (
            <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          ) : null}
        </div>
      );
    },
    message: () => <div className="prose max-w-none" />,
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!form) return null;

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
        return <React.Fragment key={key}>{element}</React.Fragment>;
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
