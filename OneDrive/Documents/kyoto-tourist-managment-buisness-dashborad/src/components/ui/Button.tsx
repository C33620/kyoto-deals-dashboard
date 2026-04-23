import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "var(--radius-lg)",
    fontSize: "0.9375rem",
    fontWeight: 600,
    lineHeight: 1,
    border: "1.5px solid transparent",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    transition:
      "background 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms ease, box-shadow 180ms ease",
    width: fullWidth ? "100%" : undefined,
    minHeight: "48px",
    whiteSpace: "nowrap",
    boxShadow: "0 1px 2px oklch(0.2 0.01 80 / 0.06)",
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--color-primary)",
      color: "#fff",
      borderColor: "var(--color-primary)",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
      borderColor: "var(--color-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-text-muted)",
      borderColor: "transparent",
    },
    danger: {
      backgroundColor: "transparent",
      color: "var(--color-error)",
      borderColor: "var(--color-error)",
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
