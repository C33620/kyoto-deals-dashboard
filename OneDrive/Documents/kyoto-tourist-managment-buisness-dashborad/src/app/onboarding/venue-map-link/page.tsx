"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { isValidGoogleMapsUrl, saveVenue } from "@/lib/venue";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VenueMapLinkForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  // Read draft directly from URL params — no sessionStorage, no effects
  const venueName = params.get("venue_name") || "";
  const venueType = params.get("venue_type") || "";
  const addressLine = params.get("address_line") || "";

  // If params are missing, send back to step 1
  if (!venueName || !venueType || !addressLine) {
    router.replace("/onboarding/venue-basics");
    return null;
  }

  function validate(): boolean {
    if (!mapsUrl.trim()) {
      setUrlError("Paste your Google Maps link");
      return false;
    }
    if (!isValidGoogleMapsUrl(mapsUrl.trim())) {
      setUrlError("Enter a valid Google Maps link");
      return false;
    }
    setUrlError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);

    const { error } = await saveVenue({
      venue_name: venueName,
      venue_type: venueType as "cafe" | "bakery" | "restaurant",
      address_line: addressLine,
      google_maps_url: mapsUrl.trim(),
    });

    if (error) {
      console.log("Venue insert error:", error);
      setServerError("Could not save your venue. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/onboarding/venue-confirmed");
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "2rem 1.5rem",
        gap: "2rem",
      }}
    >
      {/* Step indicator */}
      <div>
        <div
          style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem" }}
        >
          {[1, 2].map((step) => (
            <div
              key={step}
              style={{
                height: "4px",
                flex: 1,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-primary)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => router.back()}
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: "1rem",
          }}
        >
          ← Back
        </button>

        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.5rem",
          }}
        >
          Step 2 of 2
        </p>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Add your Google Maps link
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          This helps tourists find your venue instantly.
        </p>
      </div>

      {/* Venue summary */}
      <div
        style={{
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--color-text)" }}>
          {venueName}
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          {venueType.charAt(0).toUpperCase() + venueType.slice(1)} ·{" "}
          {addressLine}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          flex: 1,
        }}
      >
        <FormError message={serverError} />

        <Input
          label="Google Maps link"
          name="google_maps_url"
          type="url"
          inputMode="url"
          required
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          error={urlError}
          placeholder="https://maps.google.com/..."
          hint="Open Google Maps → your business → Share → Copy link"
        />

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <Button type="submit" fullWidth loading={loading}>
            Save venue
          </Button>
        </div>
      </form>
    </main>
  );
}

// useSearchParams() requires a Suspense boundary in Next.js App Router
export default function VenueMapLinkPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            display: "flex",
            minHeight: "100dvh",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-muted)",
          }}
        >
          Loading…
        </main>
      }
    >
      <VenueMapLinkForm />
    </Suspense>
  );
}
