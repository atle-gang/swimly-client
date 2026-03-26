import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const PrismaAdapter = new PrismaNeon({
    connectionString
});
export const prisma = new PrismaClient({
    adapter: PrismaAdapter,
    errorFormat: "pretty"
});