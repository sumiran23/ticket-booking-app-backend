import express from "express";
import { reserveSeats, confirmBooking } from "../controller/booking";
import { verifyJWT } from "../middleware/jwt";

const bookingRouter = express.Router();

bookingRouter.put("/reserve", verifyJWT, reserveSeats);
bookingRouter.put("/confirm", verifyJWT, confirmBooking);

export default bookingRouter;
