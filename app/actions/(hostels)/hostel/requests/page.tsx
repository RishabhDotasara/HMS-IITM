"use client";
import { AllotmentRequest } from "@/common/allotmentRequestSchema";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { deleteRequest, getRequests } from "@/lib/actions/dbActions";
import { request } from "http";
import { Delete, LucideDelete, Router } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [request, setRequest] = useState<any>();
  const {toast} = useToast();
  const router = useRouter()
  useEffect(() => {
    //look into the type of dat, after all the setup.
    getRequests(localStorage.getItem("token") || "").then((data: any) => {
      if (data?.status == 401)
      {
        toast({title:"Session Expired!",description:"Please login again."})
        localStorage.removeItem('token');
        router.push("/auth/signin")
      }
      else if (data?.err)
      {
        toast({title:data.err})
        setRequest(null)
      }
      else
      {
        setRequest(data)
      }
    });
  }, []);

  const deleteReq= () => {
    deleteRequest(localStorage.getItem("token") || "").then((data: any) => {
      if (data.status == 401)
      {
          toast({title:"Sesson Expired!",description:"please login again."})
          localStorage.removeItem('token');
          router.push("/auth/signin")
      }
      else if (data.err)
      {
        toast({title:data.err})
      }
      else 
      {
        toast({title:"Request Deleted successfully!"})
      }
    })
  }
  return (
    <div>
      <div className="mt-20 flex items-center justify-center flex-col">
        <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl flex items-center ">
          Allotment Request
        </h1>
        <div className="flex w-full  flex-col justify-evenly mt-10 flex-wrap px-3">
         
          {request!=null && <><Card className="p-1 flex-1 min-w-fit m-3">
            <CardHeader className="text-center flex">
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="text-center flex gap-4 items-center justify-evenly">
              <div className="p-3">
                <h2 className="text-3xl mb-2 font-bold">Hostel</h2>
                <p className="font-semibold">{request.hostel.hostelName}</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl mb-2 font-bold">Room</h2>
                <p className="font-semibold">{request.room.roomNo}</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl mb-2 font-bold">Wing</h2>
                <p className="font-semibold">{request.wing.wingName}</p>
              </div>
              
            </CardContent>
          </Card>
          <Button variant={"destructive"} className="w-fit self-end mr-4" onClick={()=>{deleteReq();}}>
            Delete
          </Button></>}

          {!request && (
            <div className="text-center">
              <h1 className="text-3xl font-bold">No Requests Found</h1>
              <Link href="/actions/hostel/allocate" className="m-4 rounded-md hover:underline">Create a request</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
