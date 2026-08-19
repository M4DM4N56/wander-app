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
  status?: string;
  rows?: [{ elements: MatrixElement[] }];
}

const CHUNK_SIZE = 25;

async function fetchChunk(
  origin: string,
  chunk: Destination[],
  mode: string,
  apiKey: string,
): Promise<DistanceResult[]> {
  const destinationsParam = chunk.map((d) => `${d.lat},${d.lng}`).join("|");

  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", origin);
  url.searchParams.set("destinations", destinationsParam);
  url.searchParams.set("mode", mode);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  const data = await response.json() as MatrixResponse;

  if (!data.rows?.[0]?.elements) {
    console.warn('Distance Matrix API returned no rows:', data.status);
    return chunk.map((d) => ({ placeId: d.placeId, durationSeconds: null }));
  }

  return data.rows[0].elements.map((element, index) => ({
    placeId: chunk[index].placeId,
    durationSeconds: element.status === "OK" ? (element.duration?.value ?? null) : null,
  }));
}

export async function getTravelTimes(req: Request, res: Response): Promise<void> {
  try {
    const { originLat, originLng, destinations, mode } = req.body as {
      originLat?: number;
      originLng?: number;
      destinations?: Destination[];
      mode?: string;
    };

    console.log('[distance] received request, destinations count:', destinations?.length ?? 'undefined');

    if (originLat == null || originLng == null || !destinations || !mode) {
      res.status(400).json({ error: "originLat, originLng, destinations, and mode are required" });
      return;
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      res.status(400).json({ error: "destinations must be a non-empty array" });
      return;
    }

    const origin = `${originLat},${originLng}`;
    const apiKey = process.env.GOOGLE_API_KEY ?? "";

    const chunks: Destination[][] = [];
    for (let i = 0; i < destinations.length; i += CHUNK_SIZE) {
      chunks.push(destinations.slice(i, i + CHUNK_SIZE));
    }

    console.log('[distance] processing', chunks.length, 'chunks of up to 25');

    const chunkResults = await Promise.all(
      chunks.map((chunk) => fetchChunk(origin, chunk, mode, apiKey))
    );

    chunkResults.forEach((results, i) => {
      console.log('[distance] chunk', i, 'returned', results.length, 'results');
    });

    res.status(200).json(chunkResults.flat());
  } catch (err) {
    console.error('[distance] fatal error:', err);
    res.status(200).json([]);
  }
}
