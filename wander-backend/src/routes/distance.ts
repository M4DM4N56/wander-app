import { Router } from "express";
import { getTravelTimes } from "../controllers/distanceController";

const router = Router();

router.post("/", getTravelTimes);

export default router;
