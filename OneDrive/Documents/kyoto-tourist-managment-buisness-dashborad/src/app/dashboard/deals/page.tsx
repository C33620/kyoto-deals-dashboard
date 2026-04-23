"use client";

import Button from "@/components/ui/Button";
import {
  DEAL_TYPE_LABELS,
  deleteDeal,
  formatEndAt,
  getDeals,
  isExpired,
  toggleDealActive,
} from "@/lib/deals";
import type { Deal } from "@/types";
import Link from "next/link";
import { startTransition, useCallback, useEffect, useState } from "react";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await getDeals();
    startTransition(() => {
      setDeals(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(deal: Deal) {
    const nextActive = !deal.is_active;
    setTogglingId(deal.id);

    const { error } = await toggleDealActive(deal.id, nextActive);

    startTransition(() => setTogglingId(null));

    if (error) return;

    await load();
  }

  function handleDeleteRequest(id: string) {
    setConfirmDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteId) return;

    const id = confirmDeleteId;
    setDeletingId(id);
    setConfirmDeleteId(null);

    const { error } = await deleteDeal(id);

    startTransition(() => setDeletingId(null));

    if (error) return;

    await load();
  }

  function handleDeleteCancel() {
    setConfirmDeleteId(null);
  }

  const activeDeals = deals.filter((d) => d.is_active && !isExpired(d.end_at));
  const inactiveDeals = deals.filter(
    (d) => !d.is_active || isExpired(d.end_at),
  );

  return (
    <main style={{ padding: "1.5rem", paddingBottom: "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Your Deals
        </h1>
        <Link href="/dashboard/deals/new" style={{ textDecoration: "none" }}>
          <Button style={{ padding: "0.625rem 1rem", fontSize: "0.875rem" }}>
            + New deal
          </Button>
        </Link>
      </div>

      {loading && (
        <>
          <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "96px",
                  borderRadius: "var(--radius-lg)",
                  background: `linear-gradient(90deg,
                    var(--color-surface-offset) 25%,
                    #e6e4df 50%,
                    var(--color-surface-offset) 75%)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </>
      )}

      {!loading && deals.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "4rem 1rem",
            gap: "1rem",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-faint)"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <div>
            <p style={{ fontWeight: 600, color: "var(--color-text)" }}>
              No deals yet
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-text-muted)",
                marginTop: "0.25rem",
              }}
            >
              Create your first deal to start attracting tourists.
            </p>
          </div>
          <Link href="/dashboard/deals/new" style={{ textDecoration: "none" }}>
            <Button>Create a deal</Button>
          </Link>
        </div>
      )}

      {!loading && activeDeals.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
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
            Active · {activeDeals.length}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {activeDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onToggle={handleToggle}
                onDelete={handleDeleteRequest}
                toggling={togglingId === deal.id}
                deleting={deletingId === deal.id}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && inactiveDeals.length > 0 && (
        <section>
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
            Inactive / Expired · {inactiveDeals.length}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {inactiveDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onToggle={handleToggle}
                onDelete={handleDeleteRequest}
                toggling={togglingId === deal.id}
                deleting={deletingId === deal.id}
              />
            ))}
          </div>
        </section>
      )}

      {confirmDeleteId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDeleteCancel();
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "oklch(from var(--color-bg) l c h / 0.8)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              boxShadow: "0 12px 40px oklch(0.2 0.01 80 / 0.18)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "oklch(from var(--color-error) l c h / 0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>

            <h2
              id="delete-modal-title"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "0.375rem",
              }}
            >
              Delete this deal?
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
                marginBottom: "1.5rem",
              }}
            >
              This action cannot be undone. The deal will be permanently removed
              from your listing.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "var(--color-error)",
                  cursor: "pointer",
                }}
              >
                Delete deal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

interface DealCardProps {
  deal: Deal;
  onToggle: (deal: Deal) => void;
  onDelete: (id: string) => void;
  toggling: boolean;
  deleting: boolean;
}

function DealCard({
  deal,
  onToggle,
  onDelete,
  toggling,
  deleting,
}: DealCardProps) {
  const expired = isExpired(deal.end_at);
  const live = deal.is_active && !expired;

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        opacity: deleting ? 0.5 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-text)",
              fontSize: "0.9375rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {deal.title}
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
            {DEAL_TYPE_LABELS[deal.deal_type as keyof typeof DEAL_TYPE_LABELS]}{" "}
            · Ends {formatEndAt(deal.end_at)}
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
            backgroundColor: live
              ? "oklch(from var(--color-success) l c h / 0.12)"
              : "#f3f0ec",
            color: live ? "var(--color-success)" : "var(--color-text-muted)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: live
                ? "var(--color-success)"
                : "var(--color-text-faint)",
            }}
          />
          {expired ? "Expired" : live ? "Live" : "Paused"}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          marginTop: "0.5rem",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {deal.description}
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.875rem",
          paddingTop: "0.875rem",
          borderTop: "1px solid var(--color-divider)",
        }}
      >
        <Link
          href={`/dashboard/deals/${deal.id}`}
          style={{
            flex: 1,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
          }}
        >
          Edit
        </Link>

        {!expired && (
          <button
            onClick={() => onToggle(deal)}
            disabled={toggling}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: deal.is_active
                ? "var(--color-warning)"
                : "var(--color-primary)",
              backgroundColor: "transparent",
              cursor: toggling ? "not-allowed" : "pointer",
              opacity: toggling ? 0.6 : 1,
            }}
          >
            {toggling ? "…" : deal.is_active ? "Pause" : "Resume"}
          </button>
        )}

        <button
          onClick={() => onDelete(deal.id)}
          disabled={deleting}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid oklch(from var(--color-error) l c h / 0.3)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-error)",
            backgroundColor: "transparent",
            cursor: deleting ? "not-allowed" : "pointer",
          }}
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
