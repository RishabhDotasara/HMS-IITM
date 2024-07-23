"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/common/authSchema";
import Link from "next/link";
import { toast, useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { ButtonLoading } from "@/components/ui/LoadingButton";
import { ArrowRight, Check, ChevronsUpDown, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import loginAtom from "@/states/loginAtom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  addRoom,
  addSuperUser,
  addWing,
  getHostels,
  getUsers,
  getWingsbyHostel,
} from "@/lib/actions/dbActions";
import {
  RoomCreate,
  RoomSchema,
  SuperUserAdd,
  SuperUserCreateSchema,
  WingCreate,
  WingSchema,
} from "@/common/modelsSchema";
import { cn } from "@/lib/utils";

export default function SuperUserCreation() {
  // ...

  const form = useForm<SuperUserAdd>({
    resolver: zodResolver(SuperUserCreateSchema),
  });
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);

  function onSubmit(values: SuperUserAdd) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    addSuperUser(values.user).then((res:any) => {
        
        });
    setLoading(false);
  }

  useEffect(() => {
    getUsers().then((res:any)=>{
        
      const filtered_users = res.filter((user:any)=>user.isSuperUser==false)
      if (filtered_users.length > 0)
      {
        setUsers(filtered_users)
      }
      else 
      {
        setUsers([]);
      }
    })
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-2 w-full">
        <h1 className="text-2xl font-bold">Add Superuser</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3"
        >
          <FormDescription className="text-red-500 text-center">This action is not reversible.</FormDescription>
           <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select User</FormLabel>
              <Select onValueChange={(e)=>{field.onChange(e)}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="User" />
                    </SelectTrigger>
                    <SelectContent>
                      {users && users.map((user:any)=>{

                       return (<SelectItem value={user.userId} key={user.userId}>{user.username}</SelectItem>)
                      })}
                      {users.length == 0 && <SelectItem value="null">All are superusers.</SelectItem>}
                     
                    </SelectContent>
                  </Select>
              </FormItem>
          )}
        />

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
