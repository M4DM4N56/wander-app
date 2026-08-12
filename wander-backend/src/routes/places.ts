import { Router } from "express";
import { getNearbyPlaces } from "../controllers/placesController";

const router = Router();

router.get("/", getNearbyPlaces);

export default router;
