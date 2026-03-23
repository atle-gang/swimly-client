import { Router } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from "../client";


config();

const router = Router();

router.get("/user/balance", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const userBalance = await prisma.$replica().balance.findUnique({
            where: {user_id: userId}      
        });

        res.status.json({balance: userBalance.balance});
    } catch (error) {
        next(error);
    }
});

router.patch("/user/balance", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const updateBalance = await prisma.$primary().balance.update({
            where: {user_id: userId},
            data: {
                balance: {increment: req.body.delta}
            }
        })

        return res.status(200).json({
            message: "Balance updated successfully",
            balance: upateBalance.balance
        });
    } catch (error) {
        next(error);
    }
});