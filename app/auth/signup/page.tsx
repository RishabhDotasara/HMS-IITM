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
import { Loader, Loader2 } from "lucide-react";
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
  createUser,
  getHostelsbyGender,
  getRoomsbyHostelandWing,
  getWingsbyHostel,
} from "@/lib/actions/dbActions";

export default function ProfileForm() {
  // ...

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
    },
  });
  const [logged, setLogged] = useRecoilState(loginAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  //form data
  const [hostels, setHostels] = useState([]);
  const [gender, setGender] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [wings, setWings] = useState([]);
  const [wingId, setWing] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (logged) {
      router.push("/actions/home");
    }
  }, [logged]);

  useEffect(() => {
    getHostelsbyGender(gender).then((data: any) => {
      setHostels(data);
    });
    console.log(hostels);
  }, [gender]);
  useEffect(() => {
    getWingsbyHostel(hostelId).then((data: any) => {
      setWings(data);
    });
  }, [hostelId]);
  useEffect(() => {
    getRoomsbyHostelandWing(wingId).then((data: any) => {
      console.log(wingId);
      setRooms(data);
    });
  }, [wingId]);

  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    console.log(values);
    try {

      createUser(values).then((res:any)=>{
        if (res?.token)
        {
          setLogged(true);
          toast({title:"SignUp Successful!", description:"Welcome to the App."});
          localStorage.setItem('token',res.token);
          setLoading(false);
          router.push("/actions/home");
        }
        else 
        {
          toast({title:res.message});
          setLoading(false);
        }
      })
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3 mt-16"
        >
          <h3 className="text-center text-2xl font-bold">Welcome to Hostel Management</h3>
          <FormDescription className="text-center">
          <div className="text-gray-400">
            <p className="text-center">
              Already have an account?
              <Link href="/auth/signin" className="dark:hover:text-white ml-1 hover:underline">
                SignIn!
              </Link>
            </p>
          </div>
            <br></br>
            <span className="text-red-500 ">
              Fill info carefully. Not editable afterwards!
            </span>
          </FormDescription>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-100">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@company.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll No.</FormLabel>
                <FormControl>
                  <Input placeholder="AE23B039" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retype Password</FormLabel>
                <FormControl>
                  <Input placeholder="*********" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e: string) => {
                      field.onChange(e), setGender(e);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e), setHostelId(e);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel: any) => {
                        return (
                          <>
                          <SelectItem value={hostel.hostelId} key={hostel.hostelId}>
                            {hostel.hostelName}
                          </SelectItem>
                          {!gender && <SelectItem value="No One">Please select a gender!</SelectItem>}
                          </>
                          
                        );
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
            name="wingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wing</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e), setWing(e);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Wing" />
                    </SelectTrigger>
                    <SelectContent>
                      {wings.map((wing: any) => {
                        return (
                          <SelectItem value={wing.wingId} key={wing.wingId}>
                            {wing.wingName}
                          </SelectItem>
                        );
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
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Select onValueChange={(e: string) => field.onChange(e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room: any) => {
                        return (
                          <SelectItem value={room.roomId} key={room.roomId}>
                            {room.roomNo}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin text-sm ml-3"/>}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
