"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"
import { useRouter } from "next/navigation";



export default function SignUpPage() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const router = useRouter();

  const handleSignUp =  async () => {
    console.log(username, email, password);

    const response=await axios.post(`${BACKEND_URL}/user/signup`,{username,email,password});
    console.log(response);
    
    if(response?.status==200){
      router.push("signin")
    }

  }
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="johndoe" onChange={ e =>{
              setUsername(e.target.value);
            }} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" onChange={ e =>{
              setEmail(e.target.value);
            }} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={ e =>{
              setPassword(e.target.value);
            }} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" onChange={ e =>{
              setPassword(e.target.value);
            }} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full"   onClick={handleSignUp} >Create Account</Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
