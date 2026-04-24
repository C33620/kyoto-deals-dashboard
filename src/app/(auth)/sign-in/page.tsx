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
}

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(email: string, password: string): boolean {
    const next: FormErrors = {};

    if (!email.trim()) {
      next.email = "Enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Enter your password";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const form = e.currentTarget;
    const rawEmail = (form.elements.namedItem("email") as HTMLInputElement)
      .value;
    const rawPassword = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    if (!validate(rawEmail, rawPassword)) return;

    const email = rawEmail.trim().toLowerCase();
    const password = rawPassword;

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("signInWithPassword error:", error);
        setServerError(error.message || "Email or password is incorrect");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected sign-in error:", err);
      setServerError("Something went wrong while signing in");
    } finally {
      setLoading(false);
    }
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
          Welcome back
        </h1>

        <p style={{ color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          Sign in to manage your deals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <FormError message={serverError} />

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
          autoComplete="current-password"
          required
          error={errors.password}
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.9375rem",
          color: "var(--color-text-muted)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
        >
          Create one
        </Link>
      </p>
    </main>
  );
}
