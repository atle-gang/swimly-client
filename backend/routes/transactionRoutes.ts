import { Router } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from "../client";


config();

const router = Router();

router.get