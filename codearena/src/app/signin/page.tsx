"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

export default function SignInPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
     const router = useRouter();

     const handleSignIn = async () => {
        console.log(password);
        const response=await axios.post(`${BACKEND_URL}/user/login`,{email,password});
        console.log(response);
    
       if(response?.status==200){
          router.push("home")
          console.log(response.data.token);
          
          localStorage.setItem("token", response.data.token);
        }
        else {
          setError("Invalid credentials. Please try again.");
        }
      }
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="john@example.com"  onChange={ e =>{
              setEmail(e.target.value);
            }} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password"  onChange={ e =>{
              setPassword(e.target.value);
            }} required />
            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full"   onClick={handleSignIn} >Login</Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
