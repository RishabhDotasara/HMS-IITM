"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHostels } from "@/lib/actions/dbActions";
import adminAtom from "@/states/adminAtom";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function page() {

  const [hostels, setHostels]  = useState([])
  const router = useRouter()
  const [isAdmin, setAdmin] = useRecoilState(adminAtom)

  useEffect(()=>{
    getHostels()
    .then((hostels:any)=>{
      setHostels(hostels);
      console.log(hostels);
    })
  },[])
  return (
    <div>
      
      <div className="mt-20 flex items-center justify-center flex-col">
        <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
          Hostels
        </h1>
        <div className="flex w-4/5 full justify-evenly mt-10 flex-wrap gap-3">
        {hostels.map((hostel:any)=>{
          return (

          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-center">{hostel.hostelName}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            
            <CardContent>
              
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>
                      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Name
                      </h4>
                    </Label>
                    {hostel.hostelName}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label><h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Total Rooms
                      </h4></Label>
                    {hostel.singleRooms+hostel.doubleRooms+hostel.tripleRooms}
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label ><h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Allotment
                      </h4></Label>
                    {hostel.allotmentStatus ? "Open" : "Closed"}
                  </div>
                  
                  <Button className="w-full" disabled={hostel.allotmentStatus ? false : true} onClick={()=>{router.push("/actions/hostel/allocate")}}>Participate</Button>
                  {!hostel.allotmentStatus && isAdmin && <Button>Start Allocation</Button>}
                  {hostel.allotmentStatus && isAdmin &&  <Button>Stop Allocation</Button>}


                </div>
             
            </CardContent>
          </Card>
          )
        })}
        </div>
      </div>
    </div>
  );
}
