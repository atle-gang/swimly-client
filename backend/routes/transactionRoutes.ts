import { Router } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from "../client";


config();

const router = Router();

router.post("/user/transactions", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const existingUser = await prisma.$replica().user.findUnique({
            where: {user_id: userId}
        });

        if (!existingUser) {
            return res.status(404).message("User not found");
        } else {
            const point_amount = req.body.point_amount ?? null;
            const money_amount = req.body.money_amount ?? null;

            const newLesson = await prisma.$primary().transaction.create({
                user: {
                    connect: {user_id: userId}
                },
                children_names: req.body.children_names,
                health_concerns: req.body.health_concerns,
                transaction_date: req.body.transaction_date,
                payment_type: req.body.payment_type,
                lesson_date: req.body.lesson_date,
                lesson_time: req.body.lesson_time,
                nap_times: req.body.nap_times,
                point_amount,
                money_amount
            });

            return res.status(201).message("Lesson scheduled successfully");
        }
    } catch (error) {
        next(error);
    }
});

router.get("/user/transactions", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const existingUser = await prisma.$replica().user.findUnique({
            where: {user_id: userId}
        });

        if (!existingUser) {
            return res.status(404).message("User not found");
        } else {
            const page = req.query.page;
            const limit = req.query.limit ?? 10;
            const skip = (page - 1) * limit;

            const transactions = await prisma.$replica().transaction.findMany({
                where: {user_id: userId},
                skip,
                take: limit,
                orderBy: {lesson_date: 'desc'}
            });

            return res.status(200).json(transactions);
        }
    } catch (error) {
        next(error);
    }
});