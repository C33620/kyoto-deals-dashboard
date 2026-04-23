"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  DEAL_TYPE_OPTIONS,
  getDeal,
  minEndAt,
  toDatetimeLocal,
  updateDeal,
} from "@/lib/deals";
import type { DealType } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormErrors {
  title?: string;
  description?: string;
  deal_type?: string;
  end_at?: string;
}

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dealType, setDealType] = useState<DealType | "">("");
  const [finePrint, setFinePrint] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    async function load() {
      const deal = await getDeal(id);
      if (!deal) {
        router.replace("/dashboard/deals");
        return;
      }
      setTitle(deal.title);
      setDescription(deal.description);
      setDealType(deal.deal_type as DealType);
      setFinePrint(deal.fine_print ?? "");
      setEndAt(toDatetimeLocal(deal.end_at));
      setFetching(false);
    }
    load();
  }, [id, router]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Enter a title";
    else if (title.length > 60) next.title = "Max 60 characters";
    if (!description.trim()) next.description = "Enter a description";
    else if (description.length > 160) next.description = "Max 160 characters";
    if (!dealType) next.deal_type = "Choose a deal type";
    if (!endAt) next.end_at = "Choose an end date";
    else if (new Date(endAt) <= new Date())
      next.end_at = "End date must be in the future";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);

    const { error } = await updateDeal(id, {
      title,
      description,
      deal_type: dealType as DealType,
      fine_print: finePrint,
      end_at: new Date(endAt).toISOString(),
    });

    if (error) {
      setServerError("Could not update deal. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/deals");
  }

  if (fetching) {
    return (
      <main style={{ padding: "1.5rem" }}>
        <div
          style={{
            height: "400px",
            borderRadius: "var(--radius-lg)",
            background: `linear-gradient(90deg,
              var(--color-surface-offset) 25%,
              var(--color-surface-dynamic, #e6e4df) 50%,
              var(--color-surface-offset) 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      </main>
    );
  }

  return (
    <main style={{ padding: "1.5rem", paddingBottom: "5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/dashboard/deals"
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          ← Deals
        </Link>
        <h1
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginTop: "1rem",
          }}
        >
          Edit deal
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <FormError message={serverError} />

        <Input
          label="Title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="e.g. Free matcha with any cake"
        />

        <Textarea
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          placeholder="e.g. Order any slice of cake and get a free matcha latte."
          charCount={description.length}
          maxChars={160}
        />

        <Select
          label="Deal type"
          required
          value={dealType}
          onChange={(e) => setDealType(e.target.value as DealType)}
          options={DEAL_TYPE_OPTIONS}
          error={errors.deal_type}
        />

        <Input
          label="Ends at"
          type="datetime-local"
          required
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          error={errors.end_at}
          min={minEndAt()}
        />

        <Textarea
          label="Fine print"
          value={finePrint}
          onChange={(e) => setFinePrint(e.target.value)}
          placeholder="e.g. One per table. Dine-in only."
          charCount={finePrint.length}
          maxChars={120}
        />

        <div style={{ paddingTop: "0.5rem" }}>
          <Button type="submit" fullWidth loading={loading}>
            Save changes
          </Button>
        </div>
      </form>
    </main>
  );
}
