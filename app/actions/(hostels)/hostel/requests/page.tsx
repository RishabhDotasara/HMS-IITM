"use client";
import { AllotmentRequest } from "@/common/allotmentRequestSchema";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { deleteRequest, getRequests } from "@/lib/actions/dbActions";
import { request } from "http";
import {
  Delete,
  DeleteIcon,
  Loader2,
  LucideDelete,
  Router,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Page() {
  const [request, setRequest] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [roomates, setRoommates] = useState([]);
  const { toast } = useToast();
  const router = useRouter();

  const renderRequests = () => {
    setLoading(true);
    getRequests(localStorage.getItem("token") || "").then((data: any) => {
      if (data?.status == 401) {
        toast({
          title: "Session Expired!",
          description: "Please login again.",
        });
        localStorage.removeItem("token");
        router.push("/auth/signin");
        setLoading(false);
      } else if (data?.err) {
        toast({ title: data.err });
        setRequest(null);
        setLoading(false);
      } else {
        console.log(data);
        setRequest(data);
        setRoommates(data?.users);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    //look into the type of dat, after all the setup.
    renderRequests();
  }, []);

  const deleteReq = () => {
    setLoading(true);
    deleteRequest(localStorage.getItem("token") || "").then((data: any) => {
      if (data.status == 401) {
        toast({ title: "Sesson Expired!", description: "please login again." });
        localStorage.removeItem("token");
        setLoading(false);
        router.push("/auth/signin");
      } else if (data.err) {
        setLoading(false);
        toast({ title: data.err });
      } else {
        setLoading(false);
        toast({ title: "Request Deleted successfully!" });
        renderRequests();
      }
    });
  };

  const CustomInfo = ({ field, value }: { field: string; value: string }) => {
    return (
      <>
        <div className="mb-2">
          <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
            {field}
          </h4>
          <h4 className="scroll-m-20 text-sm font-semibold tracking-tight text-gray-400">
            {value}
          </h4>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="mt-20 flex items-center justify-center flex-col w-full">
        <h1 className="scroll-m-20 text-3xl text-center font-extrabold tracking-tight lg:text-4xl flex items-center ">
          Allotment Request
        </h1>

        <div className="w-full flex items-center justify-center">
          {request != null && (
            <div className="w-full md:p-16 flex flex-col gap-3">
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <Card className="w-[300px] p-1 md:w-[350px] mt-4">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {request?.hostel.hostelName}
                      <Button
                        className=" p-0 w-10 h-10 flex items-center justify-center bg-red-300 hover:bg-red-400 "
                        onClick={() => {
                          deleteReq();
                        }}
                      >
                        {!loading && (
                          <MdDelete className="text-xl text-red-700" />
                        )}
                        {loading && <Loader2 className="animate-spin" />}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Request created by  {request?.creatorUserId}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CustomInfo
                      field="Hostel"
                      value={request?.hostel.hostelName}
                    />
                    <CustomInfo field="Wing" value={request?.wing.wingName} />
                    <CustomInfo field="Room No" value={request?.room.roomNo} />
                    <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                      RoomMate(s)
                      {roomates.map((mate:any)=>{
                        return (
                          <h4 className="scroll-m-20 text-sm font-semibold tracking-tight text-gray-400" key={mate.userId}>
                            - {mate.username}, {mate.rollNo}
                          </h4>
                        )
                      })}
                    </h4>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {request == null && !loading && (
            <div className="text-center mt-10">
              <h1 className="text-2xl font-bold text-gray-500">
                No Requests Found
              </h1>
              <Link
                href="/actions/hostel/allocate"
                className="m-4 rounded-md hover:underline text-blue-400"
              >
                Create a request
              </Link>
            </div>
          )}
          {!request && loading && (
            <div className="text-center flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
