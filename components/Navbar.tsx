"use client";
import {
  Book,
  BookCheck,
  Building,
  Building2,
  Building2Icon,
  Cloud,
  CreditCard,
  Edit,
  Edit2Icon,
  Github,
  Home,
  Keyboard,
  LifeBuoy,
  LogOut,
  LogOutIcon,
  LucideBuilding,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Projector,
  Settings,
  User,
  User2,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import loginAtom from "@/states/loginAtom";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/actions/dbActions";
import { useToast } from "./ui/use-toast";
import adminAtom from "@/states/adminAtom";
import PageLoader from "./Loader";
import { Skeleton } from "./ui/skeleton";
import Page from "@/app/actions/(user)/home/page";
import loadingAtom from "@/states/loadingAtom";
import ProfileDialog from "./profileDialog";

function CustomLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <DropdownMenuItem
      className="flex gap-4 items-center cursor-pointer"
      onClick={onClick}
    >
      <Link href={href as string} className="flex gap-4 items-center cursor-pointer">{children}</Link>
    </DropdownMenuItem>
  );
}

export default function Navbar() {
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [isAdmin, setIsAdmin] = useRecoilState(adminAtom);
  const {toast} = useToast();
  const router = useRouter();
  const [loading, setLoading] = useRecoilState(loadingAtom)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token as string).then((data: any) => {
        if (data) {
          setLogged(true);
          console.log(data)
          setIsAdmin(data.isAdmin);
        }
        else 
        {
          toast({title:"Session Expired!", description:"Please login again!"})
          router.push("/auth/signin");
        }
      });
    } else {
      router.push("/auth/signin");
    }
  }, []);

  //router side effects 
  useEffect(()=>{
    //@ts-ignore
    router.events?.on("routeChangeStart",()=>{setLoading(true)})
    // @ts-ignore
    router.events?.on("routeChangeComplete",()=>{setLoading(false)})

    return ()=>{
      //@ts-ignore
      router.events?.off("routeChangeStart",()=>{setLoading(true)})
      //@ts-ignore
      router.events?.off("routeChangeComplete",()=>{setLoading(false)})
    }
  },[router])

  

  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    router.push("/auth/signin");
  };

  return (
    <div className="fixed right-0 top-0 pt-5 pr-10 flex items-center justify-end gap-3 w-full backdrop-blur-lg">
      {/* user profile */}
      <ModeToggle />
      {/* <PageLoader className="w-full z-40 min-h-screen absolute top-0 left-0 flex items-center justify-center"/> */}
      {logged && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="absolute z-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-10 h-10 rounded-full bg-gray-500"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10 min-h-fit">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CustomLink href="/actions/home">
              <Home />
              Home
            </CustomLink>
          
            <CustomLink href="/actions/hostel/hostels">
              <Building2 />
              Hostels
            </CustomLink>
            <CustomLink href="/actions/hostel/requests">
              <Building /> Hostel Allotment
            </CustomLink>
            {/* <DropdownMenuSeparator /> */}
            {/* <ProfileDialog/> */}

            {isAdmin && <><DropdownMenuSeparator />

            <CustomLink href="/actions/superuser/add">
              <UserPlus />
              Add SuperUser
            </CustomLink>
            <CustomLink href="/actions/hostel/add">
              <Plus />
              Add Hostel
            </CustomLink>
            <CustomLink href="/actions/wing/add">
              <Plus />
              Add Wing
            </CustomLink>
            <CustomLink href="/actions/room/add">
              <Plus />
              Add Room
            </CustomLink></>}

            <DropdownMenuItem
              className="flex gap-4 items-center"
              onClick={logout}
            >
              <LogOutIcon />
              LogOut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
