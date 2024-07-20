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
import { Loader, User } from "lucide-react";
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
  createAllotmentRequest,
  getHostelsbyGender,
  getRoomsbyHostelandWing,
  getUserInfo,
  getWingsbyHostel,
} from "@/lib/actions/dbActions";
import { AllotmentRequestSchema } from "@/common/allotmentRequestSchema";

export default function ProfileForm() {
  // ...

  const form = useForm<z.infer<typeof AllotmentRequestSchema>>({
    resolver: zodResolver(AllotmentRequestSchema),
    defaultValues: {
      
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const { toast } = useToast();

  //form data
  const [hostels, setHostels] = useState([]);
  const [gender, setGender] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [wings, setWings] = useState([]);
  const [wingId, setWing] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(()=>{
    getUserInfo(localStorage.getItem("token") || "")
    .then((data: any) => {
      setUser(data);
    });
  },[])

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

  function onSubmit(values: z.infer<typeof AllotmentRequestSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    createAllotmentRequest(localStorage.getItem("token") || "", values)
      .then((data: any) => {
        
          toast({title:data.message});
          router.push("/actions/hostel/requests");
        
      })
      .catch((err: any) => {
        toast({title:"Error creating request"});
        setLoading(false);
      });
      setLoading(false)
   
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3 mt-16"
        >
          <h3 className="text-center text-2xl font-bold">Create a new request</h3>

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
                          <SelectItem value={hostel.hostelId}>
                            {hostel.hostelName}
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
                          <SelectItem value={wing.wingId}>
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
                          <SelectItem value={room.roomId}>
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
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}
