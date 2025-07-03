"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"


export default function HomePage() {
  // Mock data for upcoming contests
  const [contests,setContests] =useState( [
    {
      id: 1000,
      title: "Weekly Contest #123",
      date: "May 25, 2025",
      time: "8:00 PM",
      duration: "2 hours",
      participants: 1245,
      difficulty: "Medium",
    },
    {
      id: 200,
      title: "Biweekly Contest #45",
      date: "May 28, 2025",
      time: "9:00 PM",
      duration: "1.5 hours",
      participants: 876,
      difficulty: "Easy",
    },
    {
      id: 30,
      title: "CodeArena Championship",
      date: "June 5, 2025",
      time: "7:00 PM",
      duration: "3 hours",
      participants: 2134,
      difficulty: "Hard",
    },
  ])

  
  const [recentProblems,setRecentProblems] =useState( [
    {
      id: 101,
      title: "Two Sum",
      difficulty: "Easy",
      solvedCount: 12543,
      category: "Arrays",
      acceptedCount: 10000,
      attemptedCount: 15000,
    },
    {
      id: 102,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      solvedCount: 8765,
      category: "Strings",
      acceptedCount: 10000,
      attemptedCount: 15000,
    },
    {
      id: 103,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      solvedCount: 4321,
      category: "Arrays",
      acceptedCount: 10000,
      attemptedCount: 15000,
    },
    {
      id: 104,
      title: "Valid Parentheses",
      difficulty: "Easy",
      solvedCount: 10987,
      category: "Stacks",
      acceptedCount: 10000,
      attemptedCount: 15000,
    },
  ]);

  useEffect(() => {
    
    const getData = async () => {
        // console.log("token",localStorage.getItem('token'));
        const resonse =await axios.get(`${BACKEND_URL}/contest/`,{
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
      console.log(resonse);
      if(resonse?.status==200)
      setContests((prev)=>[...prev,resonse.data]);
     const resonse2 =await axios.get(`${BACKEND_URL}/problems/`,{
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
      console.log(resonse2);
      if(resonse?.status==200)
      setContests(resonse.data);


      if(resonse2?.status==200) setRecentProblems(resonse2.data);
      



      
    }

    getData();
  }, []);

  // Mock data for recent problems




  const getDifficultyColor = (difficulty: string) => {
    // console.log(difficulty);
    
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to CodeArena</h1>

      {/* Upcoming Contests Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Contests</h2>
          <Link href="/contests">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest,index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">{contest.title}</CardTitle>
                <CardDescription>
                  <Badge className={getDifficultyColor(contest.difficulty || "medium")}>{contest.difficulty || "medium"}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span>
                      {contest.date || "July 1,2025"} at {contest.time || "8:00     PM"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    <span>{contest.duration || "2 Hours"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 opacity-70" />
                    <span>{contest.participants} participants</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/contests/${contest.id}/register`} className="w-full">
                  <Button className="w-full">Register</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Problems Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Problems</h2>
          <Link href="/gym">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Difficulty</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Solved</th>
              </tr>
            </thead>
            <tbody>
              {recentProblems.map((problem) => (
                <tr key={problem.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/problems/${problem.id}`} className="font-medium hover:text-primary">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  </td>
                  <td className="px-4 py-3">{problem.category || "Array"}</td>
                  <td className="px-4 py-3">{(problem.acceptedCount /problem.attemptedCount )*100 || "100"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
