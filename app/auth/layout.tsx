"use client"

import { ModeToggle } from '@/components/ModeToggle'
import Navbar from '@/components/Navbar'
import React from 'react'
import { RecoilRoot } from 'recoil'

export default function layout({children}:{children:React.ReactNode}) { 
  return (
    <div>
       <RecoilRoot>
       <Navbar/>
      {children}
      </RecoilRoot>
    </div>
  )
}
