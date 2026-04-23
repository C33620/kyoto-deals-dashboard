import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  charCount?: number;
  maxChars?: number;
}

export default function Textarea({
  label,
  error,
  hint,
  charCount,
  maxChars,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <label
          htmlFor={textareaId}
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          {label}
          {props.required && (
            <span
              style={{ color: "var(--color-error)", marginLeft: "0.25rem" }}
            >
              *
            </span>
          )}
        </label>
        {maxChars !== undefined && charCount !== undefined && (
          <span
            style={{
              fontSize: "0.75rem",
              color:
                charCount > maxChars
                  ? "var(--color-error)"
                  : "var(--color-text-faint)",
            }}
          >
            {charCount}/{maxChars}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          fontSize: "1rem",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-text)",
          outline: "none",
          resize: "vertical",
          minHeight: "96px",
          fontFamily: "inherit",
          lineHeight: 1.6,
        }}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : hint
              ? `${textareaId}-hint`
              : undefined
        }
        aria-invalid={error ? "true" : undefined}
        {...props}
      />

      {hint && !error && (
        <p
          id={`${textareaId}-hint`}
          style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${textareaId}-error`}
          role="alert"
          style={{ fontSize: "0.8125rem", color: "var(--color-error)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
