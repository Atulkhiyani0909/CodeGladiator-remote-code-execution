import type { Request, Response } from "express";
import prisma from "../DB/db.js";
import bcrypt from "bcryptjs";
import accessAndRefreshToken from "../utils/token.js";
import { z } from 'zod'

const options = {
    httpOnly: true,
    secure: true
}


const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});


const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
});


class Auth {
    signUp = async (req: Request, res: Response) => {


        const validation = signupSchema.safeParse(req.body);


        if (!validation.success) {
            return res.status(400).json({
                msg: "Validation Error",
                errors: validation.error.format()
            });
        }

        const { email, password, username } = validation.data;

        try {

            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) {
                return res.status(409).json({ msg: "User with this email already exists" });
            }

            const hashed_password = await bcrypt.hash(password, 10);

            const new_user = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashed_password
                }
            })

            const { accessToken, refreshToken } = await accessAndRefreshToken(new_user);

            await prisma.user.update({
                where: {
                    id: new_user.id,
                },
                data: {
                    refreshToken: refreshToken
                }
            })

            return res.status(200)
                .cookie("refreshToken", refreshToken, options)
                .cookie("accessToken", accessToken, options)
                .json(
                    {
                        msg: "User SignUP Successfully"
                    }
                );

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "User SignUp Failed" });
        }

    }

    login = async (req: Request, res: Response) => {

        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ msg: "Invalid Input" });
        }

        const { email, password } = validation.data;

        try {

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!user) {
                return res.status(401).json(
                    {
                        msg: "Invalid Credentials"
                    }
                )
            }

            //@ts-ignore
            const password_check = await bcrypt.compare(password, user.password);

            if (!password_check) {
                return res.status(200).json({
                    msg: "Invalid Credentials Try Again"
                })
            }

            const { accessToken, refreshToken } = await accessAndRefreshToken(user);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    refreshToken: refreshToken
                }
            })

            return res.status(200)
                .cookie("refreshToken", refreshToken, options)
                .cookie("accessToken", accessToken, options)
                .json({
                    msg: "User created SuccessFully"
                })


        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "User Login Failed" });
        }

    }
}


export default Auth;
