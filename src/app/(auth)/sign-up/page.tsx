"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormErrors {
  email?: string;
  password?: string;
  contact_name?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(email: string, password: string, name: string): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.contact_name = "Enter your name";
    if (!email.trim()) next.email = "Enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Enter a password";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const contact_name = (
      form.elements.namedItem("contact_name") as HTMLInputElement
    ).value;

    if (!validate(email, password, contact_name)) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { contact_name } },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding/venue-basics");
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
        <Link
          href="/welcome"
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          ← Back
        </Link>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginTop: "1.25rem",
            color: "var(--color-text)",
          }}
        >
          Create your account
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          Register your business to get started.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <FormError message={serverError} />

        <Input
          label="Contact name"
          name="contact_name"
          type="text"
          autoComplete="name"
          required
          error={errors.contact_name}
          placeholder="Your name"
        />

        <Input
          label="Business email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          error={errors.email}
          placeholder="you@yourbusiness.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.password}
          hint="At least 6 characters"
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth loading={loading}>
          Continue
        </Button>
      </form>

      {/* Switch to sign in */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.9375rem",
          color: "var(--color-text-muted)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/sign-in"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
