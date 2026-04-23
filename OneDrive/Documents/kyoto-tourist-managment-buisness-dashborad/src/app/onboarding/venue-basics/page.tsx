"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { getUserVenue } from "@/lib/venue";
import type { VenueType } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VENUE_TYPE_OPTIONS = [
  { value: "cafe", label: "Café" },
  { value: "bakery", label: "Bakery" },
  { value: "restaurant", label: "Restaurant" },
];

interface FormErrors {
  venue_name?: string;
  venue_type?: string;
  address_line?: string;
}

// Store step 1 data in sessionStorage to pass to step 2
const STORAGE_KEY = "venue_basics_draft";

export default function VenueBasicsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState<VenueType | "">("");
  const [addressLine, setAddressLine] = useState("");

  // Check if venue already exists — redirect to settings if so
  useEffect(() => {
    async function check() {
      const existing = await getUserVenue();
      if (existing) {
        // Venue exists — populate for editing or redirect to dashboard
        router.replace("/dashboard");
        return;
      }

      // Restore draft if user navigated back
      const draft = sessionStorage.getItem(STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setVenueName(parsed.venue_name || "");
          setVenueType(parsed.venue_type || "");
          setAddressLine(parsed.address_line || "");
        } catch {}
      }

      setLoading(false);
    }
    check();
  }, [router]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!venueName.trim()) next.venue_name = "Enter your venue name";
    if (!venueType) next.venue_type = "Choose a venue type";
    if (!addressLine.trim()) next.address_line = "Enter your address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    // Pass data to step 2 via URL search params — no sessionStorage needed
    const params = new URLSearchParams({
      venue_name: venueName,
      venue_type: venueType,
      address_line: addressLine,
    });

    router.push(`/onboarding/venue-map-link?${params.toString()}`);
  }

  if (loading) {
    return (
      <main
        style={{ padding: "2rem 1.5rem", color: "var(--color-text-muted)" }}
      >
        Checking your account…
      </main>
    );
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
      {/* Header */}
      <div>
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            marginBottom: "1.5rem",
          }}
        >
          {[1, 2].map((step) => (
            <div
              key={step}
              style={{
                height: "4px",
                flex: 1,
                borderRadius: "var(--radius-full)",
                backgroundColor:
                  step === 1 ? "var(--color-primary)" : "var(--color-divider)",
              }}
            />
          ))}
        </div>

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
          Step 1 of 2
        </p>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Tell us about your venue
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          This is how your business will appear to tourists.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleNext}
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
          label="Venue name"
          name="venue_name"
          type="text"
          required
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          error={errors.venue_name}
          placeholder="e.g. Sakura Café"
        />

        <Select
          label="Venue type"
          name="venue_type"
          required
          value={venueType}
          onChange={(e) => setVenueType(e.target.value as VenueType)}
          options={VENUE_TYPE_OPTIONS}
          error={errors.venue_type}
        />

        <Input
          label="Address"
          name="address_line"
          type="text"
          required
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          error={errors.address_line}
          placeholder="e.g. 12 Shijo-dori, Gion, Kyoto"
          hint="Use the address tourists would find on Google Maps."
        />

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <Button type="submit" fullWidth>
            Next →
          </Button>
        </div>
      </form>
    </main>
  );
}
