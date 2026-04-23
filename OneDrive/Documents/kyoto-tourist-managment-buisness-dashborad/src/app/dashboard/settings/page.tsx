"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const supabase = createClient();

type Section = "venue" | "profile" | "password" | "danger";

export default function SettingsPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<Section>("venue");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Venue fields
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [venueId, setVenueId] = useState<string | null>(null);

  // Profile fields
  const [contactName, setContactName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: venue }, { data: profile }] = await Promise.all([
        supabase
          .from("business_venues")
          .select("id, venue_name, venue_type, address_line, google_maps_url")
          .eq("owner_user_id", user.id)
          .single(),
        supabase
          .from("profiles")
          .select("contact_name, business_email, phone_number")
          .eq("id", user.id)
          .single(),
      ]);

      if (venue) {
        startTransition(() => {
          setVenueId(venue.id);
          setVenueName(venue.venue_name ?? "");
          setVenueType(venue.venue_type ?? "");
          setAddressLine(venue.address_line ?? "");
          setGoogleMapsUrl(venue.google_maps_url ?? "");
        });
      }
      if (profile) {
        startTransition(() => {
          setContactName(profile.contact_name ?? "");
          setBusinessEmail(profile.business_email ?? "");
          setPhoneNumber(profile.phone_number ?? "");
        });
      }
    }
    load();
  }, []);

  function showSuccess() {
    setSaveSuccess(true);
    setTimeout(() => startTransition(() => setSaveSuccess(false)), 2500);
  }

  async function saveVenue() {
    if (!venueId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("business_venues")
      .update({
        venue_name: venueName,
        venue_type: venueType,
        address_line: addressLine,
        google_maps_url: googleMapsUrl,
      })
      .eq("id", venueId);
    startTransition(() => setSaving(false));
    if (error) setError(error.message);
    else showSuccess();
  }

  async function saveProfile() {
    setSaving(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        contact_name: contactName,
        business_email: businessEmail,
        phone_number: phoneNumber,
      })
      .eq("id", user.id);
    startTransition(() => setSaving(false));
    if (error) setError(error.message);
    else showSuccess();
  }

  async function savePassword() {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    startTransition(() => setSaving(false));
    if (error) setError(error.message);
    else {
      showSuccess();
      startTransition(() => {
        setNewPassword("");
        setConfirmPassword("");
      });
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  async function handleDeleteAccount() {
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  const tabs: { key: Section; label: string }[] = [
    { key: "venue", label: "Venue" },
    { key: "profile", label: "Profile" },
    { key: "password", label: "Password" },
    { key: "danger", label: "Account" },
  ];

  return (
    <main style={{ padding: "1.5rem", paddingBottom: "5rem" }}>
      <h1
        style={{
          fontSize: "1.375rem",
          fontWeight: 700,
          color: "var(--color-text)",
          marginBottom: "1.5rem",
        }}
      >
        Settings
      </h1>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          backgroundColor: "var(--color-surface-offset)",
          borderRadius: "var(--radius-lg)",
          padding: "0.25rem",
          marginBottom: "1.75rem",
        }}
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setActiveSection(key);
              setError(null);
              setSaveSuccess(false);
            }}
            style={{
              flex: 1,
              padding: "0.5rem 0.25rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 180ms ease",
              backgroundColor:
                activeSection === key
                  ? "var(--color-surface-2)"
                  : "transparent",
              color:
                activeSection === key
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
              boxShadow:
                activeSection === key
                  ? "0 1px 3px oklch(0.2 0.01 80 / 0.08)"
                  : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {saveSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            backgroundColor: "oklch(from var(--color-success) l c h / 0.10)",
            color: "var(--color-success)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Saved successfully
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            backgroundColor: "oklch(from var(--color-error) l c h / 0.10)",
            color: "var(--color-error)",
            fontSize: "0.9375rem",
            marginBottom: "1.25rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Venue section */}
      {activeSection === "venue" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="Venue name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            required
          />
          <Input
            label="Venue type"
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
            placeholder="e.g. Restaurant, Café, Shop"
          />
          <Input
            label="Address"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />
          <Input
            label="Google Maps URL"
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            type="url"
            hint="Paste your Google Maps link so tourists can find you easily."
          />
          <Button
            onClick={saveVenue}
            disabled={saving}
            style={{ marginTop: "0.5rem" }}
          >
            {saving ? "Saving…" : "Save venue"}
          </Button>
        </div>
      )}

      {/* Profile section */}
      {activeSection === "profile" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="Contact name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <Input
            label="Business email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            type="email"
          />
          <Input
            label="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
          />
          <Button
            onClick={saveProfile}
            disabled={saving}
            style={{ marginTop: "0.5rem" }}
          >
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      )}

      {/* Password section */}
      {activeSection === "password" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            hint="At least 8 characters."
          />
          <Input
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
          <Button
            onClick={savePassword}
            disabled={saving}
            style={{ marginTop: "0.5rem" }}
          >
            {saving ? "Updating…" : "Update password"}
          </Button>
        </div>
      )}

      {/* Account / danger section */}
      {activeSection === "danger" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Sign out */}
          <div
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "0.25rem",
              }}
            >
              Sign out
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-text-muted)",
                marginBottom: "1rem",
              }}
            >
              You will be redirected to the sign-in page.
            </p>
            <button
              onClick={handleSignOut}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>

          {/* Delete account */}
          <div
            style={{
              padding: "1.25rem",
              backgroundColor: "oklch(from var(--color-error) l c h / 0.05)",
              border: "1px solid oklch(from var(--color-error) l c h / 0.25)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: "var(--color-error)",
                marginBottom: "0.25rem",
              }}
            >
              Delete account
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-text-muted)",
                marginBottom: "1rem",
              }}
            >
              This permanently deletes your venue, deals, and all data. This
              cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  border:
                    "1px solid oklch(from var(--color-error) l c h / 0.4)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-error)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                Delete my account
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <Input
                  label='Type "DELETE" to confirm'
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                />
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteInput("");
                    }}
                    style={{
                      flex: 1,
                      padding: "0.625rem",
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
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE"}
                    style={{
                      flex: 1,
                      padding: "0.625rem",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "#fff",
                      backgroundColor: "var(--color-error)",
                      opacity: deleteInput !== "DELETE" ? 0.4 : 1,
                      cursor:
                        deleteInput !== "DELETE" ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete forever
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
