"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ArrowLeft, Calendar, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data for contests
const mockContests = [
  {
    id: 1,
    title: "Weekly Challenge #1",
    description: "A collection of algorithmic problems focusing on dynamic programming and graph theory.",
    startDate: new Date(2025, 4, 25, 10, 0),
    duration: 180, // minutes
    problemCount: 5,
  },
  {
    id: 2,
    title: "Data Structures Special",
    description: "Test your knowledge of advanced data structures with these challenging problems.",
    startDate: new Date(2025, 5, 2, 14, 0),
    duration: 120, // minutes
    problemCount: 3,
  },
  {
    id: 3,
    title: "Beginner Friendly Contest",
    description: "Perfect for newcomers to competitive programming. Focus on basic algorithms and problem-solving.",
    startDate: new Date(2025, 5, 10, 9, 0),
    duration: 90, // minutes
    problemCount: 4,
  },
]

export default function ContestsPage() {
  const [contests, setContests] = useState(mockContests)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-purple-400">My Contests</h1>
            </div>
            <Link href="/contests/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Contest
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 mt-2">Manage your competitive programming contests</p>
        </header>

        {contests.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">No Contests Yet</h2>
            <p className="text-gray-400 mb-6">Create your first contest to get started</p>
            <Link href="/contests/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Contest
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <Link key={contest.id} href={`/contests/${contest.id}`} className="block">
                <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="text-purple-400">{contest.title}</CardTitle>
                    <CardDescription className="text-gray-400">{contest.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{format(contest.startDate, "PPP")}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {format(contest.startDate, "p")} • {contest.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{contest.problemCount} problems</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Badge className="bg-purple-600">{new Date() > contest.startDate ? "Completed" : "Upcoming"}</Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
