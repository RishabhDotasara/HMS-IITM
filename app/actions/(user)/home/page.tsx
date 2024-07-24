"use client"

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { getUserInfo } from '@/lib/actions/dbActions'
import { SignUpType } from '@/common/authSchema'
import { toast, useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function CustomCard({title,content}:{title:string,content:string}){
  return(
    
    <Button variant={"secondary"} className='p-16 flex flex-col w-full md:w-1/3 hover:shadow-sm hover:shadow-blue-400'>

      <h1 className='text-2xl'>{title}</h1>
      {content}
    </Button>
  )

}

export default function Page() {

  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const {toast} = useToast()
  const router = useRouter()

  useEffect(()=>{
    console.log("User Info Page");
    setLoading(true)
    getUserInfo(localStorage.getItem("token") || "")
    .then((userInfo:any)=>{

      if (userInfo.status == 401)
      {
        toast({title:"Session Expired!",description:"Please login again!"})
        localStorage.removeItem('token')
        setLoading(false);
        router.push("/auth/signin")
      }
      else 
      {
        setUser(userInfo);
        setLoading(false);
        console.log(userInfo)

      }
      
    })
    .catch((err)=>{
      console.log(err);
    })

  },[])
    
  return (
    <div className='mt-20 flex items-center justify-center flex-col mb-10'>
      
      <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
      Your Info
    </h1>
    {user && !loading && <div className='flex w-4/5 full justify-evenly mt-10 flex-wrap gap-3'>
        <CustomCard title='Username'  content={user.username}/>
        <CustomCard title='Roll No.'  content={user.rollNo}/>
        <CustomCard title='Hostel'  content={user.hostel.hostelName}/>
        <CustomCard title='Room'  content={user.room.roomNo}/>
        <CustomCard title='Hostel'  content={user.hostel.hostelName}/>
        <CustomCard title='Email'  content={user.email}/>
      
    </div>}
    {loading && <Loader2 className="animate-spin ml-3 mt-10"/>}
    {/* <h1 className='text-2xl font-bold mt-10 text-blue-400 max-w-fit px-12'>Click on the profile to take any action!</h1> */}
    </div>
  )
}
