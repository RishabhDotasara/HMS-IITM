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
import { ArrowRight, Loader, Loader2 } from "lucide-react";
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
import { addRoom, addWing, getHostels, getWingsbyHostel } from "@/lib/actions/dbActions";
import { RoomCreate, RoomSchema, WingCreate, WingSchema } from "@/common/modelsSchema";

export default function ProfileForm() {
  // ...

  const form = useForm<RoomCreate>({
    resolver:zodResolver(RoomSchema)
  });
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [hostels, setHostels] = useState([]);
  const [hostel, setHostel] = useState("")
  const [wings, setWings] = useState([])
  
  function onSubmit(values: RoomCreate) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    addRoom(values).then((res:any)=>{
      console.log(res)
      toast({title:res.message});
      // router.push("/actions/")
      setLoading(false);
    })
  }

  useEffect(()=>{
    getHostels().then((data:any)=>{setHostels(data)})
  },[])

  useEffect(()=>{
    getWingsbyHostel(hostel).then((data:any)=>{setWings(data)})
  },[hostel])

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3 mb-36"
        >
          <h3 className="text-center text-2xl font-bold">Add Room</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-100">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem className="w-100">
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wing</FormLabel>
                <FormControl>
                  <Select onValueChange={(e)=>{field.onChange(e),setHostel(e)}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel:any)=>{

                       return (<SelectItem value={hostel.hostelId} key={hostel.hostelId}>{hostel.hostelName}</SelectItem>)
                      })}
                     
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wing</FormLabel>
                <FormControl>
                  <Select onValueChange={(e)=>{field.onChange(e)}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Wing" />
                    </SelectTrigger>
                    <SelectContent>
                      {wings.map((wing:any)=>{

                       return (<SelectItem value={wing.wingId} key={wing.wingId}>{wing.wingName}</SelectItem>)
                      })}
                     
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
         

          <Button type="submit" disabled={loading} className="w-full">
            Add
          {loading && <Loader2 className="animate-spin ml-3"/>}
            
          </Button>
        </form>
      </Form>
    </div>
  );
}
