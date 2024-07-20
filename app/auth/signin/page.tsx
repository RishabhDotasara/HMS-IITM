"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInSchema, SignInType } from "@/common/authSchema"
import Link from "next/link"
import { useRecoilState, useSetRecoilState } from "recoil"
import toastAtom from "@/states/toastAtom"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import loginAtom from "@/states/loginAtom"
import Navbar from "@/components/Navbar"


export default function ProfileForm() {
  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema)
  })
  const {toast} = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [logged,setLogged] = useRecoilState(loginAtom);


  useEffect(()=>{
    if (logged)
    {
      router.push("/actions/home");
    }
  },[logged])
 
  const onSubmit = (values:SignInType)=>{
    setLoading(true)
    console.log(values);
    try 
    {

      fetch("http://localhost:3000/api/v1/auth/signin",{
        method:"POST",
        body:JSON.stringify(values),
        headers:{
          "Content-type":"Application/json"
        }
      }).then(res=>res.json()).then(data=>{
        if (data.token)
        {
          // console.log(data);
          localStorage.setItem('token',data.token);
          // toast("User Created!");
          toast({title:"Signin Successful!",description:"Welcome to the App."});
          setLogged(true);
          router.push("/actions/home")
        }
        else 
        {
          toast({title:"Error Signing in, try again!",description:data.message});
        }
        
      })}

      catch(err)
      {
        console.log(err);
      }
      setLoading(false);
      }

      
  
  
  // ...

  return (
    <div className="flex items-start justify-center min-h-screen">

    
    <Form {...form}>
    <Navbar/>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-4/5 md:w-1/4 outline-1 p-3 mt-40">
        <div className="text-center text-2xl font-bold">Login</div>
          <div className="text-gray-400">
            <p className="text-center">Don't have an account? <Link href="/auth/signup" className="hover:text-white">Create!</Link></p>
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
              <FormDescription>
                Your Insti Roll No.
              </FormDescription>
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
                <Input placeholder="******" {...field} type="password"/>
              </FormControl>
              <FormDescription>
                Account Password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {!loading && "Submit"}
          {loading && "Signing In.."}
          </Button>
      </form>
    </Form>
    </div>
  )
}
