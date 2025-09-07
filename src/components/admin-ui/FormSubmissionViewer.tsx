"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import React from "react";

type SubmissionValue = {
  field: string;
  value: unknown;
};

// This component reads the current document via useDocumentInfo

function formatValue(value: unknown): React.ReactNode {
  if (value == null) return <em>—</em>;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "true" || trimmed === "false") return trimmed;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return trimmed;
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object") {
        return <pre style={{ margin: 0 }}>{JSON.stringify(parsed, null, 2)}</pre>;
      }
    } catch {
      // not JSON, fall through
    }
    return value;
  }
  return <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>;
}

function isSubmissionEntry(value: unknown): value is SubmissionValue {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as { field?: unknown; value?: unknown };
  return typeof obj.field === "string" && "value" in obj;
}

function extractSubmissionDataFromDoc(data: unknown): SubmissionValue[] {
  if (typeof data !== "object" || data == null) return [];
  const maybe = (data as { submissionData?: unknown }).submissionData;
  if (Array.isArray(maybe) && maybe.every(isSubmissionEntry)) {
    return maybe as SubmissionValue[];
  }
  return [];
}

export function FormSubmissionViewer() {
  const { data: docData } = useDocumentInfo();
  const submissionData: SubmissionValue[] = extractSubmissionDataFromDoc(docData);

  if (!Array.isArray(submissionData) || submissionData.length === 0) {
    return (
      <div style={{ fontStyle: "italic", color: "var(--theme-elevation-600)" }}>
        No submission data
      </div>
    );
  }

  return (
    <div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid var(--theme-elevation-200)",
                padding: "6px 8px",
              }}
            >
              Field
            </th>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid var(--theme-elevation-200)",
                padding: "6px 8px",
              }}
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {submissionData.map((entry, idx) => (
            <tr key={`${entry.field}-${idx}`}>
              <td
                style={{
                  verticalAlign: "top",
                  borderBottom: "1px solid var(--theme-elevation-100)",
                  padding: "6px 8px",
                  width: 240,
                }}
              >
                {entry.field}
              </td>
              <td
                style={{
                  verticalAlign: "top",
                  borderBottom: "1px solid var(--theme-elevation-100)",
                  padding: "6px 8px",
                }}
              >
                {formatValue(entry.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
