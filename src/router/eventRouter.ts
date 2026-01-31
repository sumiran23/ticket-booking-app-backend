import express from "express";
import { getAllEvents, getEventById } from "../controller/event";

const eventRouter = express.Router();

eventRouter.get("/", getAllEvents);

eventRouter.get("/:id", getEventById);

export default eventRouter;
