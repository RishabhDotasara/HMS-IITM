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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { allocateRooms, getHostels, startAllocation, stopAllocation } from "@/lib/actions/dbActions";
import adminAtom from "@/states/adminAtom";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Page() {

  const [hostels, setHostels]  = useState([])
  const router = useRouter()
  const [isAdmin, setAdmin] = useRecoilState(adminAtom)
  const {toast} = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    getHostels()
    .then((hostels:any)=>{
      setHostels(hostels);
      console.log(hostels);
      setLoading(false)
    })
  },[])

  const startAccepting =  (hostelId:string)=>{
      startAllocation(hostelId,localStorage.getItem('token') as string).then((data:any)=>{
        if (data?.status == 401)
        {
          toast({title:'Session Expired', description:"Please login again."})
        }
        else if (data?.status == 403)
        {
          toast({title:'Admin Access required!', description:"You are not authorized to perform this action."})
        }
        else 
        {
          toast({title:'Started Accepting Requests', description:"  This hostel is now accepting requests."})
          getHostels()
          .then((hostels:any)=>{
            setHostels(hostels);
          })
        }
      })
  }

  const stopAccepting =  (hostelId:string)=>{
      stopAllocation(hostelId,localStorage.getItem('token') as string).then((data:any)=>{
        if (data?.status == 401)
        {
          toast({title:'Session Expired', description:"Please login again."})
        }
        else if (data?.status == 403)
        {
          toast({title:'Admin Access required!', description:"You are not authorized to perform this action."})
        }
        else 
        {
          toast({title:'Not Accepting Requests!', description:"This hoste is not accepting requests anymore."})
          getHostels()
          .then((hostels:any)=>{
            setHostels(hostels);
          })
        }
      })
  }

  const startAllotment = (hostelId:string)=>{
    toast({title:'Allotment Started!', description:"Allotment has been started for the hostel."})
        getHostels()
        .then((hostels:any)=>{
          setHostels(hostels);
        })
    allocateRooms(hostelId, localStorage.getItem('token') as string).then((data:any)=>{
      
      if (data?.status == 401)
      {
        toast({title:'Session Expired', description:"Please login again."})
      }
      else if (data?.status == 403)
      {
        toast({title:'Admin Access required!', description:"You are not authorized to perform this action."})
      }
      else if (data?.status == 303)
      {
        toast({title:"Stop Accepting requests for the hostel first!", description:"Please stop accepting requests for the hostel before starting allotment."})
      }
      else if (data?.status == 200)
      {
          toast({title:"Allotment Completed!", description:"Emails have been sent to the students."})
          getHostels()
          .then((hostels:any)=>{
            setHostels(hostels);
          })

      }
    
    })
  }
  return (
    <div>
      
      <div className="mt-20 flex items-center justify-center flex-col">
        <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
          Hostels
        </h1>
        <div className="flex w-4/5 full justify-evenly mt-10 flex-wrap gap-3">
        {hostels.map((hostel:any)=>{
          return (

          <Card className="w-[350px] h-fit" key={hostel.hostelId}>
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
                  {!hostel.allotmentStatus && isAdmin && <Button onClick={()=>{startAccepting(hostel.hostelId)}}>Accept Requests</Button>}
                  {hostel.allotmentStatus && isAdmin &&  <Button onClick={()=>{stopAccepting(hostel.hostelId)}}>Stop Accepting</Button>}
                  {isAdmin && hostel.appliedStudents.length > 0 && hostel.allotmentDone==false&&  <Button onClick={()=>{startAllotment(hostel.hostelId)}}>Start Allocation</Button>}
                  


                </div>
             
            </CardContent>
          </Card>
          )
        })}
  
        {hostels.length == 0 && !loading && <h1 className="text-2xl">No Hostels Found</h1>}
        </div>
      </div>
    </div>
  );
}
