import Button from "@/components/ui/Button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      {/* Logo mark */}
      <div style={{ marginBottom: "auto" }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          aria-label="Kyoto Deals"
        >
          <rect width="40" height="40" rx="10" fill="var(--color-primary)" />
          <path
            d="M12 28V12h4l4 7 4-7h4v16h-4V19l-4 6-4-6v9h-4z"
            fill="white"
          />
        </svg>
      </div>

      {/* Hero text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1rem",
          paddingBlock: "3rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "var(--color-text)",
          }}
        >
          Promote your venue to tourists nearby
        </h1>
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--color-text-muted)",
            maxWidth: "36ch",
            lineHeight: 1.6,
          }}
        >
          Create deals for your café, bakery, or restaurant and show them inside
          the Kyoto live congestion map.
        </p>
      </div>

      {/* CTA block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          paddingBottom: "1rem",
        }}
      >
        <Link href="/sign-up" style={{ textDecoration: "none" }}>
          <Button fullWidth>Create business account</Button>
        </Link>
        <Link href="/sign-in" style={{ textDecoration: "none" }}>
          <Button variant="secondary" fullWidth>
            Sign in
          </Button>
        </Link>
      </div>
    </main>
  );
}
