import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export default function Select({
  label,
  options,
  error,
  hint,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        htmlFor={selectId}
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--color-text)",
        }}
      >
        {label}
        {props.required && (
          <span style={{ color: "var(--color-error)", marginLeft: "0.25rem" }}>
            *
          </span>
        )}
      </label>

      <select
        id={selectId}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          fontSize: "1rem",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          backgroundColor: "var(--color-surface-2)",
          color: props.value ? "var(--color-text)" : "var(--color-text-muted)",
          outline: "none",
          minHeight: "48px",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a7974' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          paddingRight: "2.5rem",
        }}
        aria-describedby={
          error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
        }
        aria-invalid={error ? "true" : undefined}
        {...props}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <p
          id={`${selectId}-hint`}
          style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${selectId}-error`}
          role="alert"
          style={{ fontSize: "0.8125rem", color: "var(--color-error)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
