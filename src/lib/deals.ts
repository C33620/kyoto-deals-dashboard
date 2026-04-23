import { createClient } from "@/lib/supabase/client";
import type { Deal, DealType } from "@/types";

export const DEAL_TYPE_OPTIONS = [
  { value: "discount", label: "Discount" },
  { value: "free_item", label: "Free item" },
  { value: "bundle", label: "Bundle" },
  { value: "happy_hour", label: "Happy hour" },
  { value: "special_menu", label: "Special menu" },
  { value: "other", label: "Other" },
];

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  discount: "Discount",
  free_item: "Free item",
  bundle: "Bundle",
  happy_hour: "Happy hour",
  special_menu: "Special menu",
  other: "Other",
};

export interface DealPayload {
  title: string;
  description: string;
  deal_type: DealType;
  fine_print: string;
  end_at: string;
}

// Fetch all deals for the authenticated user's venue
export async function getDeals(): Promise<Deal[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get venue ID first
  const { data: venue } = await supabase
    .from("business_venues")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (!venue) return [];

  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("venue_id", venue.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// Fetch a single deal by ID
export async function getDeal(id: string): Promise<Deal | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

// Create a new deal
export async function createDeal(
  payload: DealPayload,
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: venue } = await supabase
    .from("business_venues")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (!venue)
    return { error: "No venue found. Please register your venue first." };

  const { error } = await supabase.from("deals").insert({
    venue_id: venue.id,
    title: payload.title.trim(),
    description: payload.description.trim(),
    deal_type: payload.deal_type,
    fine_print: payload.fine_print.trim() || null,
    end_at: payload.end_at,
    is_active: true,
    is_featured: true,
  });

  return { error: error?.message };
}

// Update an existing deal
export async function updateDeal(
  id: string,
  payload: DealPayload,
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("deals")
    .update({
      title: payload.title.trim(),
      description: payload.description.trim(),
      deal_type: payload.deal_type,
      fine_print: payload.fine_print.trim() || null,
      end_at: payload.end_at,
    })
    .eq("id", id);

  return { error: error?.message };
}

// Toggle is_active on a deal
export async function toggleDealActive(
  id: string,
  is_active: boolean,
): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("deals")
    .update({ is_active })
    .eq("id", id);
  return { error: error?.message };
}

// Delete a deal permanently
export async function deleteDeal(id: string): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("deals").delete().eq("id", id);
  return { error: error?.message };
}

// Format end_at date for <input type="datetime-local">
export function toDatetimeLocal(iso: string): string {
  return iso.slice(0, 16);
}

// Get minimum datetime-local value (now + 1 hour)
export function minEndAt(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
}

// Check if a deal is expired
export function isExpired(end_at: string): boolean {
  return new Date(end_at) < new Date();
}

// Format date for display
export function formatEndAt(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
