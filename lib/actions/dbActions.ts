"use server";

import { AllotmentRequest } from "@/common/allotmentRequestSchema";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { RoomCreate, SuperUserAdd, WingCreate } from "@/common/modelsSchema";
import nodemailer, { Transporter } from "nodemailer";
import bcrypt from "bcryptjs";
import { SignInType, SignUpType } from "@/common/authSchema";

type ResponseType = {
  message: string;
  token?: string;
  err?: any;
};

export async function createUser(data: SignUpType): Promise<ResponseType> {
  const body: SignUpType = data;
  console.log("Request body:", body);

  const userExists = await prisma?.user.findUnique({
    where: {
      rollNo: body.rollNo,
    },
  });
  if (userExists) {
    return { message: "User with Roll No. already exists!" };
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma?.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
        rollNo: body.rollNo,
        isSuperUser: false,
        hostelId: body.hostelId,
        roomId: body.roomId,
      },
    });

    console.log("User created:", user);

    const token = jwt.sign(
      { id: user?.userId, username: user?.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    await prisma?.$disconnect();
    return { message: "User Created!", token: token };
  } catch (err) {
    console.error("Error creating user:", err);
    await prisma?.$disconnect();
    return { message: "User not created!", err };
  }
  
}

export async function loginUser(data: SignInType) {
  const body: SignInType = data;
  console.log("Request body:", body);

  try {
    const user = await prisma?.user.findUnique({
      where: {
        rollNo: body.rollNo,
      },
    });

    const passwordCheck = await bcrypt.compare(
      body.password,
      user?.password || ""
    );

    if (!passwordCheck) {
      return { message: "Incorrect Credentials!" };
    } else {
      const token = jwt.sign(
        {
          id: user?.userId,
          username: user?.username,
          isAdmin: user?.isSuperUser,
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
      await prisma?.$disconnect();
      return { message: "Signin Successful!", token: token };
    }
  } catch (err) {
    console.error(err);
    await prisma?.$disconnect();
    return { message: "User not Found!", err };
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded_data = Object(
      jwt.verify(token, process.env.JWT_SECRET || "")
    );
    return decoded_data;
  } catch (err) {
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
  await prisma?.$disconnect();
  return hostels;
}

export async function getWingsbyHostel(hostelID: string) {
  const wings = await prisma?.wing.findMany({
    where: {
      hostelId: hostelID,
    },
  });
  await prisma?.$disconnect();
  return wings;
}

export async function getRoomsbyHostelandWing(wingID: string) {
  const rooms = await prisma?.room.findMany({
    where: {
      wingId: wingID.toString(),
      
    },
    include: {
      appliedStudents: true,
    },
  });
  await prisma?.$disconnect();
  return rooms;
}

export async function getRoomsbyHostelandWingandCapacity(wingID: string, capacity: number) {
  const rooms = await prisma?.room.findMany({
    where: {
      wingId: wingID.toString(),
      capacity: parseInt(capacity.toString())
    },
    include: {
      appliedStudents: true,
    },
  });
  await prisma?.$disconnect();
  return rooms;
}

export async function getUserInfo(token: string) {
  const decoded = await verifyToken(token);
  if (decoded) {
    console.log(decoded);
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
    await prisma?.$disconnect();
    return user;
  } else {
    await prisma?.$disconnect();
    return { status: 401 };
  }
}

export async function getHostels() {
  const hostels = await prisma?.hostel.findMany({
    include: {
      appliedStudents: true,
    },
  });
  await prisma?.$disconnect();
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
        creatorUserId: decoded.id,
      },
    });

    const hostel = await prisma?.hostel.findUnique({
      where: {
        hostelId: data.hostelId,
      },
    });

    const connectUsers = [];
    if (data.roommate1)
    {
      connectUsers.push({userId:data.roommate1})
    }
    if (data.roommate2)
    {
      connectUsers.push({userId:data.roommate1})
    }

    if (!existingRequest && hostel?.allotmentStatus) {
      const request = await prisma?.allotment.create({
        data: {
          creatorUserId: decoded.id,
          wingId: data.wingId,
          roomId: data.roomId,
          hostelId: data.hostelId,
          users:{
            connect:[...connectUsers,{userId:decoded.id}]
          }
        },
      });
      if (request) {
        await prisma?.$disconnect();
        return { message: "Request created successfully" };
      } else {
        await prisma?.$disconnect();
        return { message: "Request creation failed" };
      }
    } else if (existingRequest) {
      await prisma?.$disconnect();
      return { message: "User already has an allotment request" };
    } else if (hostel?.allotmentStatus == false) {
      await prisma?.$disconnect();
      return { message: "Hostel is not allocating seats right now." };
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getRequests(token: string) {
  const decoded = await verifyToken(token);
  if (decoded) {
    try {
      const requests = await prisma?.allotment.findFirst({
        where: {
          users:{
            some:{
              userId:decoded.id
            }
          }
        },
        include: {
          room: true,
          wing: true,
          hostel: true,
          users:true
        },
      });
      await prisma?.$disconnect();
      return requests;
    } catch (err) {
      await prisma?.$disconnect();
      return { err: err };
    }
  } else {
    await prisma?.$disconnect();
    return { status: 401 };
  }
}

export async function deleteRequest(token: string) {
  try {
    const decoded = await verifyToken(token);
    if (decoded) {
      await prisma?.allotment.deleteMany({
        where: {
          users:{
            some:{
              userId:decoded.id
            }
          }
        },
      });
      await prisma?.$disconnect();
      return { message: "Request deleted successfully" };
    } else {
      await prisma?.$disconnect();
      return { status: 401 };
    }
  } catch (err) {
    console.log(err);
    await prisma?.$disconnect();
    return { err: err };
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
    await prisma?.$disconnect();
    return "Hostel added successfully";
  } catch (err) {
    console.log(err);
    await prisma?.$disconnect();
    return "Error on server, please try again!";
  }
}

export async function addWing(data: WingCreate) {
  try {
    //the admin check can further be enchanced by taking token as the input and checking if it is admin executing the operation.
    //check if the wing with same name already exists
    const existingWing = await prisma?.wing.findFirst({
      where: {
        wingName: data.name,
        hostelId: data.hostel,
      },
    });

    if (!existingWing) {
      await prisma?.wing
        .create({
          data: {
            wingName: data.name,
            hostelId: data.hostel,
          },
        })
        .then((wing: any) => {
          console.log(wing);

          return "Wing Created!";
        });
    } else {
      await prisma?.$disconnect();
      return "Wing with name already exists in this hostel!";
    }
  } catch (err) {
    console.log(err);
    await prisma?.$disconnect();
    return "Error on the server creating a wing!";
  }
}

export async function addRoom(data: RoomCreate) {
  try {
    //check if the room with same name already exists
    const existingRoom = await prisma?.room.findFirst({
      where: {
        roomNo: data.name,
        wingId: data.wing,
        hostelId: data.hostel,
      },
    });

    if (!existingRoom) {
      await prisma?.room
        .create({
          data: {
            roomNo: data.name,
            wingId: data.wing,
            hostelId: data.hostel,
            capacity: data.capacity,
          },
        })
        .then((room: any) => {
          console.log(room);
          return "Room Created!";
        });
    } else {
      await prisma?.$disconnect();
      return "Room with name already exists in this hostel!";
    }
  } catch (err) {
    console.log(err);
    await prisma?.$disconnect();
    return "Error on the server creating a room!";
  }
}

export async function getUsers() {
  const users = await prisma?.user.findMany();
  await prisma?.$disconnect();
  return users;
}

export async function addSuperUser(userId: string) {
  try {
    await prisma?.user
      .update({
        where: {
          userId: userId,
        },
        data: {
          isSuperUser: true,
        },
      })
      .then(() => {
        return "Super User Added!";
      });
    await prisma?.$disconnect();
  } catch (err) {
    console.log(err);
    await prisma?.$disconnect();
    return "Error on the server adding super user!";
  }
}

export async function startAllocation(hostelId: string, token: string) {
  try {
    const decoded = await verifyToken(token);
    if (decoded && decoded.isAdmin) {
      await prisma?.hostel.update({
        where: {
          hostelId: hostelId,
        },
        data: {
          allotmentStatus: true,
          allotmentDone:false
        },
      });
      await prisma?.$disconnect();
    } else if (!decoded) {
      await prisma?.$disconnect();
      return { status: 401 };
    } else if (decoded.isAdmin == false) {
      await prisma?.$disconnect();
      return { status: 403 };
    }
  } catch (err) {
    await prisma?.$disconnect();
    return { err: err };
  }
}

export async function stopAllocation(hostelId: string, token: string) {
  try {
    const decoded = await verifyToken(token);
    if (decoded && decoded.isAdmin) {
      await prisma?.hostel.update({
        where: {
          hostelId: hostelId,
        },
        data: {
          allotmentStatus: false,
        },
      });
    } else if (!decoded) {
      return { status: 401 };
    } else if (decoded.isAdmin == false) {
      return { status: 403 };
    }
  } catch (err) {
    return { err: err };
  }
  await prisma?.$disconnect();
}

export async function getTransporter(): Promise<Transporter> {
  //create the transporter using nodemailer
  const transporter = nodemailer.createTransport({
    
    host: 'smtp-relay.brevo.com',
    port: 587, // Use 465 for SSL
    secure: false, // Use true for SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
}
export async function getHtml(username: string, roomNo: string, hostelName: string, wing: string, roommate1?: string, roommate2?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hostel Allotment Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e0f7fa;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-top: 10px solid #007bff;
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .header img {
            max-width: 100px;
        }
        .content {
            margin-top: 20px;
        }
        .content p {
            line-height: 1.6;
        }
        .content ul {
            list-style: none;
            padding: 0;
        }
        .content ul li {
            background-color: #f1f8ff;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #777;
            font-size: 0.9em;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hostel Allotment Notification</h1>
        </div>
        <div class="content">
            <p>Dear <strong>${username}</strong>,</p>
            <p>We are pleased to inform you that you have been allotted a room in our hostel. Here are the details of your allotment:</p>
            <ul>
                <li><strong>Hostel Name:</strong> ${hostelName}</li>
                <li><strong>Wing:</strong> ${wing}</li>
                <li><strong>Room Number:</strong> ${roomNo}</li>
                ${roommate1 ? `<li><strong>Roommate 1:</strong> ${roommate1}</li>` : ''}
                ${roommate2 ? `<li><strong>Roommate 2:</strong> ${roommate2}</li>` : ''}
            </ul>
            <p>We hope you have a comfortable and enjoyable stay. If you have any questions or need further assistance, please do not hesitate to contact us.</p>
            <p>Welcome to your new home!</p>
            <a href="mailto:support@example.com" class="button">Contact Support</a>
            <p>Sincerely,</p>
            <p><strong>HMS-IITM</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated email, please do not reply.</p>
            <p>&copy; 2024 HMS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}


async function sendEmails(requests: any[], transporter: Transporter, hostel: any, failed_emails?: any[]) {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  for (const request of requests) {
    for (const user of request.users) {
      const options = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Regarding Room Allotment in " + hostel?.hostelName + " Hostel",
        html: await getHtml(user.username, request.room.roomNo, hostel?.hostelName, request.wing.wingName),
      };

      try {
        await transporter.sendMail(options);
        console.log("EMAIL SENT TO:" + user.email);
      } catch (error) {
        console.log("ERROR SENDING EMAIL TO " + user.email);
        console.error(error);
        failed_emails?.push(request);
      }

      await delay(5000); // Delay between sending emails
    }
  }
}



// actual allocation algorithm, we are going to use first come first serve algo over here for now, we can late introduce new algos,
// if the project grows.
export async function allocateRooms(hostelId: string, token: string) {
 

  //this is to resend the emails if they fail.
  const failed_emails:any  = [];

  const decoded = await verifyToken(token);
  if (decoded && decoded.isAdmin) {
    //get the hostel
    const hostel = await prisma?.hostel.findUnique({
      where: {
        hostelId: hostelId,
      },
    });
    if (hostel?.allotmentStatus == true) {
      return { status: 303 }; // stop accepting requests first.
    } else if (hostel?.allotmentStatus == false) {
      // get all the requests that this hostel has
      const requests = await prisma?.allotment.findMany({
        where: {
          hostelId: hostelId,
        },
        include: {
          users:true,
          room: true,
          wing: true,
          hostel: true,
        },
      });
      //the logic i'm thinking right now is
      //ki take the first capacity stuents out of the applied students list, mail them you have benn alloted the room
      // pr baki ka kya?
      // either the user fills a preference or do not show them the room that is already applied upto the capacity.

      //ok start going through all the requests and allocate the rooms
      // so by following the above algo, we have students equal to the capacity of the room, now we can allocate them the room.
      //directly send them the mail that they have been alloted the room.
      //they can show it to claim the room, and we can use the applied students data to know who is going to go in which room.

      //get the transporter

      const transporter = await getTransporter();

      await sendEmails(requests as any[],transporter, hostel, failed_emails);
      
      //after one leg of sending emails is complete, we will check if there's any email that failed to send and resend them.
      if (failed_emails.length > 0) {
        await sendEmails( failed_emails,transporter,hostel);
      }
      console.log("Allotment done!");
      await prisma?.hostel.update({
        where:{
          hostelId:hostelId
        },
        data:{
          allotmentDone:true
        }
      })

      return {status:200}
    }
  } else if (decoded?.isAdmin == false) {
    return { status: 403 };
  } else {
    return { status: 401 };
  }
}
