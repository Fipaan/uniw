import mongoose from "mongoose";
import { ENV } from "./env.js";
import log from "../utils/log.js";

export async function connectDb(): Promise<void> {
    mongoose.set("strictQuery", true);
    await mongoose.connect(ENV.MONGO_URI);
    log.INFO("MongoDB connected");
}
