import { Router } from "express";
import { getNearbyPlaces, getPlacePhoto } from "../controllers/placesController";

const router = Router();

router.get("/", getNearbyPlaces);
router.get("/photo/:photoReference", getPlacePhoto);

export default router;
