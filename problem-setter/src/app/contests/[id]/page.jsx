"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, FileText, Edit, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"

// Mock data for a specific contest
const mockContestDetails = {
  id: 1,
  title: "Weekly Challenge #1",
  description: "A collection of algorithmic problems focusing on dynamic programming and graph theory.",
  startDate: new Date(2025, 4, 25, 10, 0),
  duration: 180, // minutes
  problems: [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      points: 100,
    },
    {
      id: 2,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      points: 200,
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "hard",
      points: 300,
    },
    {
      id: 4,
      title: "Valid Parentheses",
      difficulty: "easy",
      points: 100,
    },
    {
      id: 5,
      title: "Merge K Sorted Lists",
      difficulty: "hard",
      points: 300,
    },
  ],
}

export default function ContestDetailPage() {
  const params = useParams()
  const contestId = params.id

  // In a real app, you would fetch the contest data based on the ID
  const [contest, setContest] = useState(mockContestDetails)

  const handleExportContest = () => {
    const exportData = {
      ...contest,
      startDate: contest.startDate.toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contest_${contestId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center">
            <Link href="/contests">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-purple-400">{contest.title}</h1>
          </div>
          <p className="text-gray-400 mt-2">{contest.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-purple-400">Problems</h2>
                <div className="flex space-x-2">
                  <Link href={`/contests/${contestId}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Contest
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleExportContest}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {contest.problems.map((problem, index) => (
                  <Card key={problem.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                            <h3 className="font-medium">{problem.title}</h3>
                          </div>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge
                              className={
                                problem.difficulty === "easy"
                                  ? "bg-green-800 text-green-200"
                                  : problem.difficulty === "medium"
                                    ? "bg-yellow-800 text-yellow-200"
                                    : "bg-red-800 text-red-200"
                              }
                            >
                              {problem.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-400">{problem.points} points</span>
                          </div>
                        </div>
                        <Link href={`/problems/${problem.id}`}>
                          <Button variant="secondary" size="sm">
                            View Problem
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Contest Details</h2>

              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <h3 className="text-sm text-gray-400">Date</h3>
                    <p>{format(contest.startDate, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <h3 className="text-sm text-gray-400">Time</h3>
                    <p>
                      {format(contest.startDate, "p")} • {contest.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-300">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <h3 className="text-sm text-gray-400">Problems</h3>
                    <p>{contest.problems.length} problems</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <Badge className="bg-purple-600">{new Date() > contest.startDate ? "Completed" : "Upcoming"}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
