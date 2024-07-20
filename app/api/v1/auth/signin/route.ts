import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignUpType } from '@/common/authSchema';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    const body: SignUpType = await request.json();      
    console.log("Request body:", body);

    try {
        const user = await prisma?.user.findUnique({
            where:{
                rollNo:body.rollNo
            }
        });

        const passwordCheck = await bcrypt.compare(body.password, user?.password || "");

        if (!passwordCheck)
        {
            return NextResponse.json({message:"Incorrect Credentials!"});    
        }
        else 
        {
            const token = jwt.sign(
                { id: user?.userId, username: user?.username, isAdmin:user?.isSuperUser },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1h" }
            );

            return NextResponse.json({ message: "Signin Successful!", token: token});
        }
      


    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "User not Found!",err});
    }
}