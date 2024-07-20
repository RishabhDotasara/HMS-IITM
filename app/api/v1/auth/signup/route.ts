import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignUpType } from '@/common/authSchema';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    const body: SignUpType = await request.json();
    console.log("Request body:", body);

    const userExists = await prisma?.user.findUnique({
        where:{
            rollNo:body.rollNo
        }
    })
    if (userExists)
    {
        return NextResponse.json({message:"User with Roll No. already exists!"});
    }

    try {
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const user = await prisma?.user.create({
            data: {
                email: body.email,
                username: body.username,
                password: hashedPassword,
                rollNo: body.rollNo,
                isSuperUser: false,
                hostelId: body.hostelId,
               
                roomId: body.roomId
            }
        });

        console.log("User created:", user);

        const token = jwt.sign(
            { id: user?.userId, username: user?.username },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        return NextResponse.json({ message: "User Created!", token:  token });
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ message: "User not created!",err});
    }
}