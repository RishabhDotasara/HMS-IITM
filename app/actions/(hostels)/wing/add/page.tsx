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
import { ArrowRight, Loader } from "lucide-react";
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
import { addWing, getHostels } from "@/lib/actions/dbActions";
import { WingCreate, WingSchema } from "@/common/modelsSchema";

export default function ProfileForm() {
  // ...

  const form = useForm<WingCreate>({
    resolver:zodResolver(WingSchema)
  });
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [hostels, setHostels] = useState([]);

  
  function onSubmit(values: WingCreate) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    addWing(values).then((res:any)=>{
      toast({title:res});
      // router.push("/actions/")
    })
    setLoading(false);
  }

  useEffect(()=>{
    getHostels().then((data:any)=>{setHostels(data)})
  },[])

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3"
        >
          <h3 className="text-center text-2xl font-bold">Add Wing</h3>

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
            name="hostel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel</FormLabel>
                <FormControl>
                  <Select onValueChange={(e)=>{field.onChange(e)}}>
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
         

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Add
            
          </Button>
        </form>
      </Form>
    </div>
  );
}
