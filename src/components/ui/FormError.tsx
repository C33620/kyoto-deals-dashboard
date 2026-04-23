// Displays a top-level form error (e.g. wrong password, server error)

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        padding: "0.875rem 1rem",
        borderRadius: "var(--radius-md)",
        backgroundColor: "oklch(from var(--color-error) l c h / 0.08)",
        border: "1px solid oklch(from var(--color-error) l c h / 0.2)",
        color: "var(--color-error)",
        fontSize: "0.875rem",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}
