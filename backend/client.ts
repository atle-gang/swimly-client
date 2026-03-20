import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : process.env.DIRECT_URL;

const mainAdapter = new PrismaPg({
    connectionString
});
const mainClient = new PrismaClient({
    adapter: mainAdapter,
    errorFormat: "pretty"
});

const replicaAdapter1 = new PrismaPg({
    connectionString
})
const replicaClient1 = new PrismaClient({
    adapter: replicaAdapter1,
    errorFormat: "pretty"
});

const replicaAdapter2 = new PrismaPg({
    connectionString
});
const replicaClient2 = new PrismaClient({
    adapter: replicaAdapter2,
    errorFormat: "pretty"
});

export const prisma = mainClient.$extends(
    readReplicas({
        replicas: [replicaClient1, replicaClient2]
    })
);