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

function CustomCard({title,content}:{title:string,content:string}){
  return(
    <Card className='p-1 flex-1 min-w-fit hover:shadow-sm hover:shadow-blue-200 cursor-pointer' >
      <CardHeader className='text-center'>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='text-center'>{content}</CardContent>
    </Card>
  )

}

export default function page() {

  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>([])
  const {toast} = useToast()
  const router = useRouter()

  useEffect(()=>{
    console.log("User Info Page");
    getUserInfo(localStorage.getItem("token") || "")
    .then((userInfo:any)=>{

      if (userInfo.status == 401)
      {
        toast({title:"Session Expired!",description:"Please login again!"})
        localStorage.removeItem('token')
        router.push("/auth/signin")
      }
      else 
      {
        setUser(userInfo);
        
        console.log(userInfo)

      }
      
    })
    .catch((err)=>{
      console.log(err);
    })

  },[])
    
  return (
    <div className='mt-20 flex items-center justify-center flex-col'>
      
      <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
      Your Info
    </h1>
    {user && <div className='flex w-4/5 full justify-evenly mt-10 flex-wrap gap-3'>
        <CustomCard title='Username'  content={user.username}/>
        <CustomCard title='Roll No.'  content={user.rollNo}/>
        <CustomCard title='Hostel'  content={user.hostel.hostelName}/>
        <CustomCard title='Room'  content={user.room.roomNo}/>
        <CustomCard title='Hostel'  content={user.hostel.hostelName}/>
        <CustomCard title='Email'  content={user.email}/>
      
    </div>}
    </div>
  )
}
