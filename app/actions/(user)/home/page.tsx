"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { getUserInfo } from "@/lib/actions/dbActions";
import { SignUpType } from "@/common/authSchema";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  BarChartIcon,
  BellIcon,
  BookIcon,
  CalendarIcon,
  CirclePlusIcon,
  Edit,
  Edit2,
  Loader2,
  MenuIcon,
  PlusCircleIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function CustomCard({ title, content }: { title: string; content: string }) {
  return (
    <Button
      variant={"secondary"}
      className="p-16 flex flex-col w-full md:w-1/3 hover:shadow-sm hover:shadow-blue-400"
    >
      <h1 className="text-2xl">{title}</h1>
      {content}
    </Button>
  );
}

export default function Page() {
  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    console.log("User Info Page");
    setLoading(true);
    getUserInfo(localStorage.getItem("token") || "")
      .then((userInfo: any) => {
        if (userInfo.status == 401) {
          toast({
            title: "Session Expired!",
            description: "Please login again!",
          });
          localStorage.removeItem("token");
          setLoading(false);
          router.push("/auth/signin");
        } else {
          setUser(userInfo);
          setLoading(false);
          console.log(userInfo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const CustomInfo = ({field, value}:{field: string, value: string}) => {
    return (
      <>
      <div className="mb-2">
        <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
          {field}
        </h4>
        <h4 className="scroll-m-20 text-sm font-semibold tracking-tight text-gray-400">
          {value}
        </h4>
        {loading && <Skeleton className="h-[10px] w-[100px] mt-2">
          
        </Skeleton>}

      </div>
      
      </>
    );
  };

  return (
    // <h1> This is the home page, some data will be rendered here.</h1>
    <div className="mt-24 px-8 lg:px-40">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl flex items-center">
        Welcome, {user?.username} {loading && <Skeleton className="h-[35px] w-[150px] ml-2"></Skeleton>}
      </h1>
      <Card className="w-full mt-8 ">
        <CardHeader>
          <CardTitle className="flex justify-between">About You <Edit onClick={()=>{toast({title:"Feature coming soon!"})}}/></CardTitle>
          <CardDescription>Your Info in our Databases.</CardDescription>
        </CardHeader>
        <CardContent className="md:flex gap-12">
          <CustomInfo field="Username" value={user?.username} />
          <CustomInfo field="Roll No" value={user?.rollNo} />
          <CustomInfo field="Current Hostel" value={user?.hostel.hostelName} />
          <CustomInfo field="Current Room" value={user?.room.roomNo} />
          {/* <CustomInfo field="Current Room" value={user?.room.roomNo} /> */}
        </CardContent>
        {/* <CardFooter className="flex justify-between"></CardFooter> */}
      </Card>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
        Haven&apos;t created a request? <Link href="/actions/hostel/allocate" className="text-blue-400 underline">Create here!</Link>
      </h2>
    </div>
  );
}
