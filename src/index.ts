import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import pool from "./database/db";
import eventRouter from "./router/eventRouter";
import authRouter from "./router/authRouter";
import bookingRouter from "./router/bookingRouter";
import errorHandlerMiddleware from "./middleware/errorHandler";
import notFoundMiddleware from "./middleware/notFound";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/booking", bookingRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// app.get("/", (req, res) => {
//   res.send("Hello World with TypeScript and Express!");
// });

// app.get("/db-status", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     await client.query("SELECT NOW()");
//     client.release();
//     res.status(200).send("Database connected successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Database connection failed.");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
