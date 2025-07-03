"use client"

import Link from "next/link"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
// @ts-ignore
import { BACKEND_URL } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type Problem = {
  id: string | number
  title: string
  index: string
  difficulty: string
  tags: string[]
  score: number
  acceptedCount: number
}

type Contest = {
  id: string | number
  title: string
  date: string
  time: string
  duration: string
  participants: number
  description: string
}

export default function ContestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contest, setContest] = useState<Contest | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"problems" | "standings" | "submissions">("problems")
  const contestId = Number.parseInt(id as string)

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true)
        // Fetch contest details
        const contestRes = await axios.get(`${BACKEND_URL}/contest/${contestId}`,{
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        setContest(contestRes.data)
        // Fetch contest problems
        const problemsRes = await axios.get(`${BACKEND_URL}/contest/problems/${contestId}`,{
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        setProblems(problemsRes.data.data.problems || [])
      } catch (err) {
        // handle error, maybe set an error state
      }
      setLoading(false)
    }
    fetchContestDetails()
  }, [contestId])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  // Secondary navbar
  const navItems = [
    { key: "problems", label: "Problems" },
    { key: "standings", label: "Standings", route: `/contests/${contestId}/standings` },
    { key: "submissions", label: "Submissions", route: `/contests/${contestId}/submissions` }
  ]

  const handleTabChange = (key: string) => {
    if (key === "problems") {
      setActiveTab("problems")
    } else if (key === "standings") {
      router.push(`/contests/${contestId}/standings`)
    } else if (key === "submissions") {
      router.push(`/contests/${contestId}/submissions`)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">
        {contest?.title || "Contest"}
      </h1>
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor((problems[0]?.difficulty) || "medium")}>
            {(problems[0]?.difficulty) || "N/A"}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">{contest?.date} {contest?.time && `at ${contest.time}`}</span>
        <span className="text-sm text-muted-foreground">Duration: {contest?.duration}</span>
        {/* <span className="text-sm text-muted-foreground">Participants: {contest?.participants}</span> */}
      </div>
      <div className="mb-8 text-muted-foreground">{contest?.description}</div>
      {/* Secondary Nav */}
      <div className="border-b mb-8">
        <nav className="flex gap-2">
          {navItems.map(item => (
            <Button
              key={item.key}
              variant={activeTab === item.key ? "default" : "ghost"}
              onClick={() => handleTabChange(item.key)}
              className="rounded-none"
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      {/* Content based on tab */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-8 h-8 mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {activeTab === "problems" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map(problem => (
                <Card key={problem.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">{problem.index}</span>
                      <span className="text-lg">{problem.title}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground">{problem.score} pts</span>
                      <span className="text-xs text-muted-foreground">{problem.acceptedCount} solved</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {/* {problem.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))} */}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/contests/${contestId}/problems/${problem.id}`} className="w-full">
                      <Button className="w-full">View Problem</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
              {problems.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No problems found for this contest.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}