import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  charCount?: number;
  maxChars?: number;
}

export default function Input({
  label,
  error,
  hint,
  charCount,
  maxChars,
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

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
          htmlFor={inputId}
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

      <input
        id={inputId}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          fontSize: "1rem",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-text)",
          outline: "none",
          transition: "border-color 180ms ease",
          minHeight: "48px",
        }}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        aria-invalid={error ? "true" : undefined}
        {...props}
      />

      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          style={{ fontSize: "0.8125rem", color: "var(--color-error)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
