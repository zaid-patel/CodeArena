"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// @ts-ignore
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import { BACKEND_URL } from "@/lib/utils"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

const TERMS = [
  "Do not use AI tools or assistants to solve problems.",
  "Plagiarism is strictly prohibited. Submissions must be your own work.",
  "Do not share solutions or hints with others during the contest.",
  "Respect the time limits and fair play guidelines.",
  "Cheating or any unfair means will result in disqualification.",
  "Enjoy the process and challenge yourself!"
]

export default function ContestRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [contest, setContest] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState(null)
    const params = useParams();
    const contestId = params.id;
  

  useEffect(() => {
    const fetchContest = async () => {
      setLoading(true)
      try {
        const result = await axios.get(`${BACKEND_URL}/contest/${contestId}`, {
          headers: {
            Authorization: localStorage.getItem("token") || ""
          }
        })
        setContest(result.data)
        // console.log("Contest data:", result.data);
        
        // Optionally, you can check if the user is already registered here
      } catch {
        setError("Could not load contest.")
      }
      setLoading(false)
    }
    fetchContest()
  }, [contestId])

  const handleRegister = async () => {
    setRegistering(true)
    setError(null)
    try {
      // You may want to add user authentication and fetch token if needed
      const token = localStorage.getItem("token")
      await axios.post(
        `${BACKEND_URL}/contest/add-participant/${contestId}`,
        {},
        { headers: { Authorization: token } }
      )
      setRegistered(true)
      router.push('/home')

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. You may already be registered or need to log in."
      )
    }
    setRegistering(false)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        <span>Loading contest...</span>
      </div>
    )

  return (
    <div className="container max-w-xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Register for {contest?.title || "Contest"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="mb-2">{contest?.date} {contest?.time && `at ${contest.time}`}</Badge>
          <div className="mb-6 text-muted-foreground">
            <b>Welcome, future champion!</b>
            <br />
            <span>
              Ready to put your skills to the test? Register for this contest and compete with passionate programmers from all over the world.
            </span>
          </div>

          <Alert variant="default" className="mb-6">
            <AlertTitle>
              <AlertCircle className="w-5 h-5 inline-block mr-1 text-yellow-500" />
              Read Before Registering
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {TERMS.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mb-6 text-green-800 font-semibold">
            Believe in yourself, trust your skills, and remember: every line of code brings you closer to greatness. Good luck!
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>
                <AlertCircle className="w-5 h-5 inline-block mr-1" />
                Error
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {registered ? (
            <Alert variant="success" className="mb-4">
              <AlertTitle>
                <CheckCircle2 className="w-5 h-5 inline-block mr-1" />
                Registered!
              </AlertTitle>
              <AlertDescription>
                You have successfully registered for <b>{contest?.title}</b>.
                <br />
                <Link href={`/contests/${contestId}`}>
                  <Button variant="outline" className="mt-3">Go to Contest Page</Button>
                </Link>
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              className="w-full"
              onClick={handleRegister}
              loading={registering}
              disabled={registering}
            >
              {registering ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Registering...
                </>
              ) : (
                "Register Now"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}