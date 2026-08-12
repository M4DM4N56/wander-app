import { Request, Response } from "express";

interface PlaceResult {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  totalRatings: number;
  types: string[];
  openNow: boolean;
}

export async function getNearbyPlaces(req: Request, res: Response): Promise<void> {
  try {
    const { lat, lng, radius, type } = req.query;

    if (!lat || !lng || !radius) {
      res.status(400).json({ error: "lat, lng, and radius are required" });
      return;
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("key", process.env.GOOGLE_API_KEY ?? "");
    if (type) {
      url.searchParams.set("type", String(type));
    }

    const response = await fetch(url.toString());
    const data = await response.json() as { results: Record<string, unknown>[] };

    const places: PlaceResult[] = data.results.map((place) => {
      const geometry = place.geometry as { location: { lat: number; lng: number } };
      const openingHours = place.opening_hours as { open_now?: boolean } | undefined;

      return {
        placeId: place.place_id as string,
        name: place.name as string,
        lat: geometry.location.lat,
        lng: geometry.location.lng,
        rating: (place.rating as number | undefined) ?? 0,
        totalRatings: (place.user_ratings_total as number | undefined) ?? 0,
        types: (place.types as string[] | undefined) ?? [],
        openNow: openingHours?.open_now ?? true,
      };
    });

    res.status(200).json(places);
  } catch {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}
