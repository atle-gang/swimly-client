import express from "express";
import cors from "cors";
import helmet from "helmet";
import { userRoutes } from "./routes/userRoutes";
import { balanceRoutes } from "./routes/balanceRoutes";
import { transactionRoutes } from "./routes/transactionRoutes";
import jwt from "jsonwebtoken";

const port = process.env.PORT ? process.env.PORT : 3000;
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors({ allowedHeaders: ['Authorization', 'Content-Type'] }));

app.use("/swimly-api/user", userRoutes);
app.use("/swimly-api/user/balance", balanceRoutes);
app.use("/swimly-api/user/transactions", transactionRoutes);

app.use((error, req, res, next) => {
    console.error("Error: ", next(error));
    res.status(500).send('Internal Server Error');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get("/", (req, res) => {
    res.status(200).send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`); 
});