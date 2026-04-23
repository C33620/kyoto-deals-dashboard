import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("contact_name")
    .eq("id", user.id)
    .single();

  const { data: venue } = await supabase
    .from("business_venues")
    .select("id, venue_name, venue_type, address_line, status")
    .eq("owner_user_id", user.id)
    .single();

  const { data: deals } = await supabase
    .from("deals")
    .select("id, is_active, end_at")
    .eq("venue_id", venue?.id ?? "");

  const now = new Date();
  const totalDeals = deals?.length ?? 0;
  const activeDeals =
    deals?.filter((d) => d.is_active && new Date(d.end_at) > now).length ?? 0;
  const expiredDeals =
    deals?.filter((d) => new Date(d.end_at) <= now).length ?? 0;

  const firstName = profile?.contact_name?.split(" ")[0] ?? null;

  return (
    <main style={{ padding: "1.5rem", paddingBottom: "5rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          👋 Hey{firstName ? `, ${firstName}` : ""}
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            marginTop: "0.25rem",
            fontSize: "0.9375rem",
          }}
        >
          Here&apos;s what&apos;s happening with your venue.
        </p>
      </div>

      {venue && (
        <div
          style={{
            backgroundColor: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.25rem",
                }}
              >
                Your venue
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--color-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {venue.venue_name}
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  marginTop: "0.125rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {venue.venue_type} · {venue.address_line}
              </p>
            </div>

            <span
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.25rem 0.625rem",
                borderRadius: "var(--radius-full)",
                backgroundColor:
                  venue.status === "active"
                    ? "oklch(from var(--color-success) l c h / 0.12)"
                    : "oklch(from var(--color-warning) l c h / 0.12)",
                color:
                  venue.status === "active"
                    ? "var(--color-success)"
                    : "var(--color-warning)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor:
                    venue.status === "active"
                      ? "var(--color-success)"
                      : "var(--color-warning)",
                }}
              />
              {venue.status === "active" ? "Listed" : "Pending"}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        {[
          {
            label: "Total deals",
            value: totalDeals,
            color: "var(--color-text)",
          },
          {
            label: "Active",
            value: activeDeals,
            color: "var(--color-success)",
          },
          {
            label: "Expired",
            value: expiredDeals,
            color: "var(--color-text-muted)",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 0.75rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color,
                lineHeight: 1,
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                marginTop: "0.375rem",
                fontWeight: 500,
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.75rem",
        }}
      >
        Quick actions
      </p>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
      >
        {[
          {
            href: "/dashboard/deals/new",
            icon: (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            ),
            label: "Create a new deal",
            sublabel: "Attract more tourists today",
          },
          {
            href: "/dashboard/deals",
            icon: (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            ),
            label: "Manage deals",
            sublabel: `${totalDeals} deal${totalDeals !== 1 ? "s" : ""} total`,
          },
          {
            href: "/dashboard/settings",
            icon: (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            ),
            label: "Settings",
            sublabel: "Edit venue & profile",
          },
        ].map(({ href, icon, label, sublabel }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-surface-offset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--color-primary)",
                }}
              >
                {icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--color-text)",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.125rem",
                  }}
                >
                  {sublabel}
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-text-faint)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
