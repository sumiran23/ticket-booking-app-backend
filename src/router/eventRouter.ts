import express from "express";
import { getAllEvents, getEvent } from "../controller/event";

const eventRouter = express.Router();

eventRouter.get("/", getAllEvents);

eventRouter.get("/:id", getEvent);

export default eventRouter;
