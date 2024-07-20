"use server";

import { AllotmentRequest } from "@/common/allotmentRequestSchema";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { RoomCreate, SuperUserAdd, WingCreate } from "@/common/modelsSchema";

export async function verifyToken(token:string)
{
  try 
  {
      const decoded_data = Object(jwt.verify(token, process.env.JWT_SECRET || ""))
      return decoded_data;
  }
  catch (err)
  {
    console.log(err);
    return false;
  }

}

export async function getHostelsbyGender(gender?: string) {
  const hostels = await prisma?.hostel.findMany({
    where: {
      hostelFor: gender?.toLowerCase(),
    },
  });
  return hostels;
}

export async function getWingsbyHostel(hostelID: string) {
  const wings = await prisma?.wing.findMany({
    where: {
      hostelId: hostelID,
    },
  });
  return wings;
}

export async function getRoomsbyHostelandWing(wingID: string) {
  const rooms = await prisma?.room.findMany({
    where: {
      wingId: wingID.toString(),
    },
  });
  return rooms;
}

export async function getUserInfo(token: string) {
  const decoded = await verifyToken(token);
  if (decoded){console.log(decoded);
  const user = await prisma?.user.findUnique({
    where: {
      userId: decoded.id,
    },
    include: {
      hostel: true,
      room: true,
    },
  });
  console.log(user);
  return user;}
  else 
  {
    return {status:401};
  }
}

export async function getHostels() {
  const hostels = await prisma?.hostel.findMany();
  return hostels;
}

export async function createAllotmentRequest(
  token: string,
  data: AllotmentRequest
) {
  try {
    const decoded = Object(
      jwt.verify(token, process.env.JWT_SECRET || "secret")
    );
    console.log(decoded);

    //check if user already has an allotment
    const existingRequest = await prisma?.allotment.findFirst({
      where: {
        userId: decoded.id,
      },
    });

    const hostel = await prisma?.hostel.findUnique({
      where:{
        hostelId:data.hostelId
      }
    })

    if (!existingRequest && hostel?.allotmentStatus) {
      const request = await prisma?.allotment.create({
        data: {
          userId: decoded.id,
          wingId: data.wingId,
          roomId: data.roomId,
          hostelId: data.hostelId,
        },
      });
      if (request) {
        return { message: "Request created successfully" };
      } else {
        return { message: "Request creation failed" };
      }
    } else if (existingRequest) {
      return { message: "User already has an allotment request" };
    }
    else if (hostel?.allotmentStatus == false)
    {
      return {message:"Hostel is not allocating seats right now."}
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getRequests(token: string) {
  const decoded = await verifyToken(token);
  if (decoded)
  {
    try 
    {
      const requests = await prisma?.allotment.findFirst({
        where: {
          userId: decoded.id,
        },
        include: {
          room: true,
          wing: true,
          hostel: true,
          user: true,
        },
      });
      return requests;

    }
    catch(err)
    {
      return {err:err};
    }
  }
  else 
  {
    return {status:401}
  }
    
}

export async function deleteRequest(token: string) {
  try {
    const decoded = await verifyToken(token)
    if (decoded)
    {
      await prisma?.allotment.deleteMany({
        where: {
          userId: decoded.id,
        },
      });
      return { message: "Request deleted successfully" };
    }
    else 
    {
      {status:401}
    }
  } catch (err) {
    console.log(err);
    return {err:err};
  }
}

type Hostel = {
  name: string;
  gender: string;

  sRooms: number;
  dRooms: number;
  tRooms: number;
};
export async function addHostel(data: Hostel) {
  try {
    console.log(data);
    const hostel = await prisma?.hostel.create({
      data: {
        hostelName: data.name,
        hostelFor: data.gender,
        singleRooms: data.sRooms,
        doubleRooms: data.dRooms,
        tripleRooms: data.tRooms,
      },
    });

    console.log(hostel);
    return "Hostel added successfully";
  } catch (err) {
    console.log(err);
    return "Error on server, please try again!";
  }
}

export async function addWing(data:WingCreate)
{
  try 
  {
    //the admin check can further be enchanced by taking token as the input and checking if it is admin executing the operation.
    //check if the wing with same name already exists
    const existingWing = await prisma?.wing.findFirst({
      where:{
        wingName:data.name,
        hostelId:data.hostel
      }
    })

    if (!existingWing )
    {

      
          prisma?.wing.create({
            data:{
              wingName:data.name,
              hostelId:data.hostel
            }
          })
          .then((wing:any)=>{
            console.log(wing);
            return "Wing Created!"
          })
    }
    else 
    {
      return "Wing with name already exists in this hostel!"
    }
  }
  catch(err)
  {
    console.log(err);
    return "Error on the server creating a wing!"
  }
}


export async function addRoom(data:RoomCreate)
{
  try 
  {
    //check if the room with same name already exists
    const existingRoom = await prisma?.room.findFirst({
      where:{
        roomNo:data.name,
        wingId:data.wing,
        hostelId:data.hostel
      }
    })

    if (!existingRoom )
    {

          prisma?.room.create({
            data:{
              roomNo:data.name,
              wingId:data.wing,
              hostelId:data.hostel,
              capacity:data.capacity
            }
          })
          .then((room:any)=>{
            console.log(room);
            return "Room Created!"
          })
    }
    else 
    {
      return "Room with name already exists in this hostel!"
    }
  }
  catch(err)
  {
    console.log(err);
    return "Error on the server creating a room!"
  }
}

export async function getUsers()
{
  const users = await prisma?.user.findMany();
  return users;
}

export async function addSuperUser(userId: string)
{
    try 
    {
        await prisma?.user.update({
          where:{
            userId:userId
          },
          data:{
            isSuperUser:true
          }
          }
        ).then(()=>{
          return "Super User Added!"
        })
    }
    catch(err)
    {
      console.log(err);
      return "Error on the server adding super user!"
    }

}