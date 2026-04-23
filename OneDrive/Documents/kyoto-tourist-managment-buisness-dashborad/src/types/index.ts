export type VenueType = "cafe" | "bakery" | "restaurant";

export type VenueStatus = "active" | "draft";

export type DealType =
  | "discount"
  | "free_item"
  | "bundle"
  | "happy_hour"
  | "special_menu"
  | "other";

export interface Profile {
  id: string;
  contact_name: string;
  business_email: string;
  phone_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessVenue {
  id: string;
  owner_user_id: string;
  venue_name: string;
  venue_type: VenueType;
  address_line: string;
  google_maps_url: string;
  normalized_name: string;
  normalized_address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: VenueStatus;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  venue_id: string;
  title: string;
  description: string;
  deal_type: DealType;
  fine_print?: string | null;
  start_at: string;
  end_at: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicActiveDeal {
  deal_id: string;
  venue_id: string;
  venue_name: string;
  venue_type: VenueType;
  normalized_name: string;
  normalized_address: string;
  google_maps_url: string;
  latitude: number | null;
  longitude: number | null;
  title: string;
  description: string;
  deal_type: string;
  fine_print: string | null;
  end_at: string;
  is_featured: boolean;
  updated_at: string;
}
