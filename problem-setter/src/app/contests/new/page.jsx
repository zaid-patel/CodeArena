"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data for available problems
const availableProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    added: false,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    added: false,
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    added: false,
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "easy",
    added: false,
  },
  {
    id: 5,
    title: "Merge K Sorted Lists",
    difficulty: "hard",
    added: false,
  },
]

export default function NewContestPage() {
  const router = useRouter()
  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    duration: "120",
  })
  const [problems, setProblems] = useState(availableProblems)
  const [selectedProblems, setSelectedProblems] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setContestData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleProblem = (id1) => {
    const id=parseInt(id)
    if (selectedProblems.includes(id)) {
      setSelectedProblems(selectedProblems.filter((problemId) => problemId !== id))
    } else {
      setSelectedProblems([...selectedProblems, id])
    }
  }

  const handleCreateContest = () => {
    // Here you would typically save the contest data to your backend
    console.log("Contest data:", {
      ...contestData,
      problems: selectedProblems,
    })

    // Redirect to contests page
    router.push("/contests")
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
            <h1 className="text-3xl font-bold text-purple-400">Create New Contest</h1>
          </div>
          <p className="text-gray-400 mt-2">Set up a new programming contest with your problems</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-purple-400">Contest Details</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Contest Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={contestData.title}
                    onChange={handleChange}
                    placeholder="Enter contest title"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={contestData.description}
                    onChange={handleChange}
                    placeholder="Describe your contest..."
                    className="min-h-[100px] bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={contestData.startDate}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={contestData.startTime}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={contestData.duration}
                    onChange={handleChange}
                    min="1"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-purple-400">Contest Problems</h2>
                <Link href="/problems/create">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Create New Problem
                  </Button>
                </Link>
              </div>

              {problems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No problems available. Create some problems first.</div>
              ) : (
                <div className="space-y-3">
                  {problems.map((problem) => (
                    <Card
                      key={problem.id}
                      className={`bg-gray-700 border-gray-600 ${
                        selectedProblems.includes(problem.id) ? "border-purple-500" : ""
                      }`}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{problem.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              problem.difficulty === "easy"
                                ? "bg-green-800 text-green-200"
                                : problem.difficulty === "medium"
                                  ? "bg-yellow-800 text-yellow-200"
                                  : "bg-red-800 text-red-200"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <Button
                          variant={selectedProblems.includes(problem.id) ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => toggleProblem(problem.id)}
                        >
                          {selectedProblems.includes(problem.id) ? (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Contest Summary</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-400">Title</h3>
                  <p className="text-gray-200">{contestData.title || "Untitled Contest"}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Date & Time</h3>
                  <p className="text-gray-200">
                    {contestData.startDate && contestData.startTime
                      ? `${contestData.startDate} at ${contestData.startTime}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Duration</h3>
                  <p className="text-gray-200">{contestData.duration} minutes</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Problems</h3>
                  <p className="text-gray-200">{selectedProblems.length} selected</p>
                </div>
              </div>

              <Button onClick={handleCreateContest} className="w-full bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" />
                Create Contest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
