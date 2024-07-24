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
import { SignInSchema, SignInType } from "@/common/authSchema";
import Link from "next/link";
import { useRecoilState, useSetRecoilState } from "recoil";
import toastAtom from "@/states/toastAtom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import loginAtom from "@/states/loginAtom";
import Navbar from "@/components/Navbar";
import { loginUser } from "@/lib/actions/dbActions";
import loadingAtom from "@/states/loadingAtom";
import { Loader, Loader2 } from "lucide-react";

export default function ProfileForm() {
  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
  });
  const { toast } = useToast();
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const router = useRouter();
  const [logged, setLogged] = useRecoilState(loginAtom);

  useEffect(() => {
    if (logged) {
      router.push("/actions/home");
    }
  }, [logged]);

  const onSubmit = (values: SignInType) => {
    setLoading(true);
    console.log(values);
    try {
        loginUser(values).then((res:any)=>{
          if (res?.token)
          {
            setLogged(true);
            toast({title:"Signin Successful!", description:"Welcome to the App."});
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
    
  };

  // ...

  return (
    <div className="flex items-start justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3 mt-40"
        >
          <div className="text-center text-2xl font-bold">Login</div>
          <div className="text-gray-400">
            <p className="text-center">
              Don&apos;t have an account?
              <Link href="/auth/signup" className="dark:hover:text-white">
                Create!
              </Link>
            </p>
          </div>
          <FormField
            control={form.control}
            name="rollNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll No.</FormLabel>
                <FormControl>
                  <Input placeholder="AE23B039" {...field} />
                </FormControl>
                <FormDescription>Your Insti Roll No.</FormDescription>
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
                  <Input placeholder="******" {...field} type="password" />
                </FormControl>
                <FormDescription>Account Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            SignIn
            {loading && <Loader2 className="animate-spin text-sm ml-3"/>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
