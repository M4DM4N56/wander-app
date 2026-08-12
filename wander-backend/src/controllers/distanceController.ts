import { Request, Response } from "express";

interface Destination {
  placeId: string;
  lat: number;
  lng: number;
}

interface DistanceResult {
  placeId: string;
  durationSeconds: number | null;
}

interface MatrixElement {
  status: string;
  duration?: { value: number };
}

interface MatrixResponse {
  rows: [{ elements: MatrixElement[] }];
}

export async function getTravelTimes(req: Request, res: Response): Promise<void> {
  try {
    const { originLat, originLng, destinations, mode } = req.body as {
      originLat?: number;
      originLng?: number;
      destinations?: Destination[];
      mode?: string;
    };

    if (originLat == null || originLng == null || !destinations || !mode) {
      res.status(400).json({ error: "originLat, originLng, destinations, and mode are required" });
      return;
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      res.status(400).json({ error: "destinations must be a non-empty array" });
      return;
    }

    const origin = `${originLat},${originLng}`;
    const destinationsParam = destinations.map((d) => `${d.lat},${d.lng}`).join("|");

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", origin);
    url.searchParams.set("destinations", destinationsParam);
    url.searchParams.set("mode", mode);
    url.searchParams.set("key", process.env.GOOGLE_API_KEY ?? "");

    const response = await fetch(url.toString());
    const data = await response.json() as MatrixResponse;

    const results: DistanceResult[] = data.rows[0].elements.map((element, index) => ({
      placeId: destinations[index].placeId,
      durationSeconds: element.status === "OK" ? (element.duration?.value ?? null) : null,
    }));

    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: "Failed to fetch travel times" });
  }
}
