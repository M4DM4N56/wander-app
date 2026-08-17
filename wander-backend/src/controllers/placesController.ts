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
  closingTime: string | null;
  photoReferences: string[];
  priceLevel: number | null;
}

const GEO_TYPES = new Set([
  'locality', 'political', 'administrative_area_level_1', 'administrative_area_level_2',
  'sublocality', 'country', 'route', 'street_address', 'geocode',
  'colloquial_area', 'neighborhood',
]);

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

    const todayDay = new Date().getDay();

    const places: PlaceResult[] = data.results
      .map((place) => {
        const geometry = place.geometry as { location: { lat: number; lng: number } };
        const openingHours = place.opening_hours as {
          open_now?: boolean;
          periods?: Array<{ open: { day: number }; close: { time: string } }>;
        } | undefined;

        let closingTime: string | null = null;
        const periods = openingHours?.periods;
        if (periods) {
          const todayPeriod = periods.find((p) => p.open.day === todayDay);
          if (todayPeriod?.close?.time) {
            const raw = todayPeriod.close.time;
            const hours = parseInt(raw.slice(0, 2), 10);
            const mins = raw.slice(2);
            const suffix = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 === 0 ? 12 : hours % 12;
            closingTime = `${displayHour}:${mins} ${suffix}`;
          }
        }

        const photoReferences: string[] = Array.isArray(place.photos)
          ? (place.photos as Array<{ photo_reference: string }>)
              .slice(0, 5)
              .map((p) => p.photo_reference)
              .filter(Boolean)
          : [];

        console.log(`Place: ${place.name as string}, Photos: ${(place.photos as unknown[] | undefined)?.length ?? 0}`);

        return {
          placeId: place.place_id as string,
          name: place.name as string,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          rating: (place.rating as number | undefined) ?? 0,
          totalRatings: (place.user_ratings_total as number | undefined) ?? 0,
          types: (place.types as string[] | undefined) ?? [],
          openNow: openingHours?.open_now ?? true,
          closingTime,
          photoReferences,
          priceLevel: (place.price_level as number | undefined) ?? null,
        };
      })
      .filter((place) => !place.types.every((t) => GEO_TYPES.has(t)));

    res.status(200).json(places);
  } catch {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}

export async function getPlacePhoto(req: Request, res: Response): Promise<void> {
  try {
    const photoReference = req.params.photoReference as string;
    const maxwidth = (req.query.maxwidth as string | undefined) ?? '400';

    const photoUrl =
      `https://maps.googleapis.com/maps/api/place/photo` +
      `?maxwidth=${maxwidth}&photoreference=${encodeURIComponent(photoReference)}&key=${process.env.GOOGLE_API_KEY ?? ""}`;

    const googleRes = await fetch(photoUrl);
    res.setHeader('Content-Type', googleRes.headers.get('content-type') || 'image/jpeg');
    const buffer = await googleRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch {
    res.status(500).json({ error: "Failed to fetch photo" });
  }
}
