import { Router } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import prisma from "../client";


config();

const router = Router();

router.post('/register', async (req, res, next) => {
    try {
        const name = req.body.name;
        const surname = req.body.surname;
        const username = req.body.username;
        const email = req.body.email;
        const genSalt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(req.body.password, genSalt);

        const newUser = await prisma.$primary().user.create({
            data: {
                name: name,
                surname: surname,
                username: username,
                email: email,
                password: hash
            }
        });

        const userId = newUser.user_id;
        const payload = {
            user: {
                id: userId,
                username: username,
                email: email,
            }
        };
        const authToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {
                expiresIn: "1h",
            }
        );

        return res.status(201).json({
            message: `User create with email ${email} created successfully`,
            name: name,
            surname: surname,
            username: username,
            email: email,
            userId: userId,
            authToken: authToken,
            expiresIn: 3600000,
            expiresAt: Date.now() + 3600000
        });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await prisma.$replica().user.findUnique({
            where: {email: email}
        });
        
        if (!existingUser) {
            return res.status(404).message("User does not exist");
        }

        const result = await bcryptjs.compare(password, existingUser.password);

        if (!result) {
            return res.status(401).message("Wrong password");
        } else {
            const userId = existingUser.user_id;
            const payload = {
                user: {
                    id: userId,
                    username: username,
                    email: email,
                }
            };
            const authToken = jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                {
                    expiresIn: "1h",
                }
            );

            return res.status(201).json({
                message: `User create with email ${email} successfully logged in`,
                name: existingUser.name,
                surname: existingUser.surname,
                username: existingUser.username,
                email: email,
                userId: userId,
                authToken: authToken,
                expiresIn: 3600000,
                expiresAt: Date.now() + 3600000
            });
        }
    } catch (error) {
        next(error);
    }
});

router.put("/change-password", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const currentUser = await prisma.$replica().user.findUnique({
            where: {user_id: userId}
        });

        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const result = await bcryptjs.compare(currentPassword, currentUser.password);

        if (!result) {
            return res.status(401).message("Password does not match");
        } else {
            const genSalt = await bcryptjs.genSalt();
            const newHash = await bcryptjs.hash(newPassword, genSalt);

            const changePassword = await prisma.$primary().user.update({
                where: {user_id: userId},
                data: {password: newHash}
            });
            
            const payload = {
                user: {id: changePassword.user_id}
            };
            const authToken = jwt.sign(payload, process.env.JWT_SECRET);

            return res.status(200).json({
                message: "Password changed successfully",
                authToken: authToken,
                username: changePassword.username
            });
        }
    } catch (error) {
        next(error);
    }
});

router.put("/reset-password", async (req, res, next) => {
    try {
        const email = req.body.email;
        const newPassword = req.body.newPassword;

        const existingUser = await prisma.$replica().user.findUnique({
            where: {email: email}
        })

        if (!existingUser) {
            return res.status(404).message("User not found");
        } else {
            const genSalt = await bcryptjs.genSalt();
            const newHash = await bcryptjs.hash(newPassword, genSalt);

            const resetUserPassword = await prisma.$primary().user.update({
                where: {email: email},
                data: {password: newHash}
            });

            const payload = {
                user: {
                    id: resetUserPassword.user_id,
                    email: email
                }
            };
            const authToken = jwt.sign(payload, process.env.JWT_SECRET);

            return res.status(200).json({
                message: "Password reset successfully",
                authToken: authToken,
                email: email
            })
        }
    } catch (error) {
        next(error);
    }
});

router.delete("/delete", async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        await prisma.$primary().user.delete({ where: {user_id: userId} });

        return res.status(200).message("User deleted successfully");
    } catch (error) {
        next(error);
    }
});