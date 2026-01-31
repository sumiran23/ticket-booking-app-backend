import express from "express";
import { reserveSeats } from "../controller/booking";
import { verifyJWT } from "../middleware/jwt";

const bookingRouter = express.Router();

bookingRouter.put("/reserve", verifyJWT, reserveSeats);

export default bookingRouter;
