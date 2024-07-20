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
import { ProfileSchema, ProfileType } from "@/common/ProfileSchema"
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"



export default function ProfileForm() {
  const [user, setUser] = useState()

  useEffect(()=>{
    
  },[])
  // ...
  const form = useForm<ProfileType>(
    {
      resolver:zodResolver(ProfileSchema),
      defaultValues:{
        username:"Rishabh",
        rollNo:"AE23B039",
        email:"rishabhdotasara@gmail.com"
      }
    }
  )

  const onSubmit = (values: ProfileType)=>{
    console.log(values)
  }
  return (
    <div className="flex items-start justify-center min-h-screen w-full">
     
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-4/5 sm:w-1/4 outline-1 p-3 mt-20">
      <h3 className="text-center text-2xl font-bold">Update Profile</h3>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Your Smail
              </FormDescription>
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
                <Input placeholder="Roll No." {...field} />
              </FormControl>
              <FormDescription>
                Insti Roll No.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
