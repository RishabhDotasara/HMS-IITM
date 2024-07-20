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
      <div className="flex gap-4 items-center cursor-pointer">{children}</div>
    </DropdownMenuItem>
  );
}

export default function Navbar() {
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [isAdmin, setIsAdmin] = useRecoilState(adminAtom);
  const {toast} = useToast();

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
        }
      });
    } else {
      router.push("/auth/signin");
    }
  }, []);

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    router.push("/auth/signin");
  };

  return (
    <div className="fixed right-0 top-0 pt-5 pr-10 flex items-center justify-end gap-3 w-full backdrop-blur-lg">
      {/* user profile */}
      <ModeToggle />
      {logged && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10 min-h-fit">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CustomLink onClick={() => router.push("/actions/home")}>
              <Home />
              Home
            </CustomLink>
            <CustomLink onClick={() => router.push("/actions/profile")}>
              <Edit />
              Edit Profile
            </CustomLink>

            <CustomLink onClick={() => router.push("/actions/hostel/hostels")}>
              <Building />
              Hostels
            </CustomLink>
            <CustomLink onClick={() => router.push("/actions/hostel/requests")}>
              <Building2 /> Hostel Allotment
            </CustomLink>

            <DropdownMenuSeparator />
            <CustomLink>
              <Settings />
              Change Password
            </CustomLink>

            {isAdmin && <><DropdownMenuSeparator />

            <CustomLink onClick={() => router.push("/actions/superuser/add")}>
              <UserPlus />
              Add SuperUser
            </CustomLink>
            <CustomLink onClick={() => router.push("/actions/hostel/add")}>
              <Building2 />
              Add Hostel
            </CustomLink>
            <CustomLink onClick={() => router.push("/actions/wing/add")}>
              <Building2 />
              Add Wing
            </CustomLink>
            <CustomLink onClick={() => router.push("/actions/room/add")}>
              <Building2 />
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
