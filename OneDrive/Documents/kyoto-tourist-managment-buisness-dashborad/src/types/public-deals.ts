export type PublicActiveDeal = {
  deal_id: string;
  venue_id: string;
  venue_name: string;
  venue_type: "cafe" | "bakery" | "restaurant";
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
};
