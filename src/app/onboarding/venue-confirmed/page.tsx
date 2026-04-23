import Button from "@/components/ui/Button";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VenueConfirmedPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: venue } = await supabase
    .from("business_venues")
    .select("venue_name, venue_type, address_line")
    .eq("owner_user_id", user.id)
    .single();

  // If no venue found, something went wrong — send back
  if (!venue) redirect("/onboarding/venue-basics");

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "2rem 1.5rem",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        textAlign: "center",
      }}
    >
      {/* Success icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "var(--radius-full)",
          backgroundColor: "var(--color-primary-highlight)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      {/* Message */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Your venue is registered!
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "32ch",
            margin: "0 auto",
          }}
        >
          You&apos;re now ready to create deals for tourists nearby.
        </p>
      </div>

      {/* Venue card */}
      <div
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "var(--color-text)",
            fontSize: "1.0625rem",
          }}
        >
          {venue.venue_name}
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          {venue.venue_type.charAt(0).toUpperCase() + venue.venue_type.slice(1)}{" "}
          · {venue.address_line}
        </p>
        <span
          style={{
            marginTop: "0.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-success)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-success)",
            }}
          />
          Active
        </span>
      </div>

      {/* CTA */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <Link
          href="/dashboard/deals/new"
          style={{ textDecoration: "none", width: "100%" }}
        >
          <Button fullWidth>Create your first deal</Button>
        </Link>
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", width: "100%" }}
        >
          <Button variant="ghost" fullWidth>
            Go to dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
