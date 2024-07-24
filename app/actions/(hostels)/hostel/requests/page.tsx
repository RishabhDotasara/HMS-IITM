"use client";
import { AllotmentRequest } from "@/common/allotmentRequestSchema";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { deleteRequest, getRequests } from "@/lib/actions/dbActions";
import { request } from "http";
import { Delete, DeleteIcon, Loader2, LucideDelete, Router } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Page() {
  const [request, setRequest] = useState<any>();
  const [loading, setLoading] = useState(false)
  const [roomates, setRoommates] = useState([]);
  const {toast} = useToast();
  const router = useRouter()

  const renderRequests = ()=>{
    setLoading(true)
    getRequests(localStorage.getItem("token") || "").then((data: any) => {
      if (data?.status == 401)
      {
        toast({title:"Session Expired!",description:"Please login again."})
        localStorage.removeItem('token');
        router.push("/auth/signin")
        setLoading(false)  
      }
      else if (data?.err)
      {
        toast({title:data.err})
        setRequest(null)
        setLoading(false)  
      }
      else
      {
        console.log(data);
        setRequest(data)
        setRoommates(data?.users);
        setLoading(false)  
        
      }
    });
  }
  useEffect(() => {
    //look into the type of dat, after all the setup.
    renderRequests();
  }, []);

  const deleteReq= () => {
    setLoading(true);
    deleteRequest(localStorage.getItem("token") || "").then((data: any) => {
      if (data.status == 401)
      {
          toast({title:"Sesson Expired!",description:"please login again."})
          localStorage.removeItem('token');
          setLoading(false);
          router.push("/auth/signin")
      }
      else if (data.err)
      {
        setLoading(false);
        toast({title:data.err})
      }
      else 
      {
        setLoading(false);
        toast({title:"Request Deleted successfully!"})
        renderRequests();
      }
    })
  }

  const CustomButton = ({title, value}:{title:string, value:string}) => {
    return (
      <Button className="p-4 h-fit flex flex-col min-w-24 w-fit hover:shadow-blue-500 hover:shadow-sm gap-2" variant={"secondary"} >
         <h1 className="text-xl">{title}</h1>
         <h1 className="text-gray-500">{value}</h1>
      </Button>
    )
  }
  

  return (
    <div>
      <div className="mt-20 flex items-center justify-center flex-col">
        <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl flex items-center ">
          Allotment Request
        </h1>
        <div className="w-full flex items-center justify-center">
         
          {request!=null && <div className="w-fit p-16 flex flex-col gap-3">
          <Button className=" p-0 w-10 h-10 flex items-center justify-center bg-red-300 hover:bg-red-400 self-end" onClick={()=>{deleteReq();}}>
            {!loading && <MdDelete className="text-xl text-red-700"/>}
            {
              loading && <Loader2 className="animate-spin"/>
            }
          </Button>
          <div className="flex gap-4 items-center justify-center flex-wrap">

              
              <CustomButton title="Hostel" value={request.hostel.hostelName} />
              <CustomButton title="Wing" value={request.wing.wingName} />
              <CustomButton title="Room" value={request.room.roomNo} />
              <CustomButton title="Capacity" value={request.room.capacity} />
              
              <Button className="p-4 h-fit flex flex-col min-w-24 w-fit hover:shadow-blue-500 hover:shadow-sm gap-2" variant={"secondary"} >
                <h1 className="text-xl">RoomMates</h1>
                <h1 className="text-gray-500">
                  <ol>
                      {roomates && roomates.map((mate:any, index:number)=>{
                        return (
                          <li className="text-left mb-1" key={index}>- {mate.username}</li>
                        )
                      })}
                  </ol>
                </h1>
              </Button>
              

          </div>
          
          </div>}

          {!request && !loading && (
            <div className="text-center mt-10">
              <h1 className="text-2xl font-bold text-gray-500">No Requests Found</h1>
              <Link href="/actions/hostel/allocate" className="m-4 rounded-md hover:underline text-blue-400">Create a request</Link>
            </div>
          )}
          {!request && loading && (
            <div className="text-center flex justify-center">
              <Loader2 className="animate-spin"/>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
