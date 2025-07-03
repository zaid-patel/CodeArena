"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, Code, XCircle, Timer, AlertCircle, FileWarning } from "lucide-react"
import Link from "next/link"
import MonacoEditor from "@/components/monaco-editor"
import axios from "axios"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/lib/utils"


// Map verdict enum to UI
const VERDICT_MAP: Record<
  string,
  {
    label: string
    color: string
    icon: React.ReactNode
  }
> = {
  Accepted: {
    label: "Accepted",
    color: "bg-green-500/10 text-green-500",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
  },
  Wrong_Answer: {
    label: "Wrong Answer",
    color: "bg-red-500/10 text-red-500",
    icon: <XCircle className="h-4 w-4 mr-1" />,
  },
  TLE: {
    label: "Time Limit Exceeded",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: <Timer className="h-4 w-4 mr-1" />,
  },
  MLE: {
    label: "Memory Limit Exceeded",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: <AlertCircle className="h-4 w-4 mr-1" />,
  },
  Runtime_Error: {
    label: "Runtime Error",
    color: "bg-orange-500/10 text-orange-500",
    icon: <AlertCircle className="h-4 w-4 mr-1" />,
  },
  Compilation_Error: {
    label: "Compilation Error",
    color: "bg-orange-500/10 text-orange-500",
    icon: <FileWarning className="h-4 w-4 mr-1" />,
  },
  Pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: <Clock className="h-4 w-4 mr-1" />,
  },
  Judging: {
    label: "Judging",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: <Clock className="h-4 w-4 mr-1" />,
  },
}

type TestCaseResult = {
  input: string
  output: string
  expected: string
  result: "passed" | "failed"
  error?: string
  runtime?: string
  memory?: string
}

type SubmissionData = {
  id: number
  problemId: number
  problemTitle: string
  language: string
  verdict: keyof typeof VERDICT_MAP
  content: string
  time: string
  runtime?: string
  memory?: string
  testCases: TestCaseResult[]
}

export default function SubmissionPage() {
  const [submission, setSubmission] = useState<SubmissionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const params=useParams();

  // Fetch submission details from backend
  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true)
      try {
        // Replace with your actual API endpoint
        const { data } = await axios.get(`${BACKEND_URL}/submission/${params.id}`,{
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        setSubmission(data)
        setLoading(false)
      } catch (e) {
        setSubmission(null)
        setLoading(false)
      }
    }
    fetchSubmission()
  }, [params.id])

  // Simulate progress bar for Pending/Judging
  useEffect(() => {
    if (!submission) return
    if (submission.verdict === "Pending" || submission.verdict === "Judging") {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(timer)
    } else {
      setProgress(100)
    }
  }, [submission])

  const getStatusBadge = (verdict: keyof typeof VERDICT_MAP) => {
    const config = VERDICT_MAP[verdict] || VERDICT_MAP["Pending"]
    return (
      <Badge className={config.color}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  if (loading || !submission) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[300px]">
        <span className="text-lg text-muted-foreground">Loading submission...</span>
      </div>
    )
  }

  // Only show the first testcase (if available)
  const visibleTestCase = submission.testCases && submission.testCases.length > 0 ? submission.testCases[0] : null

  return (
    <div className="container py-8">
      {/* Submission Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/problems/${submission.problemId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Submission Details</h1>
          {getStatusBadge(submission.verdict)}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            Problem: {submission.problemTitle}
          </div>
          <div className="flex items-center">Language: {submission.language}</div>
          <div className="flex items-center">Submitted: {new Date(submission.time).toLocaleString()}</div>
        </div>
      </div>

      {/* Processing Status */}
      {(submission.verdict === "Pending" || submission.verdict === "Judging") && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Processing Submission</CardTitle>
            <CardDescription>Your code is being evaluated</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Results (only shown when verdict is not Pending/Judging) */}
      {!(submission.verdict === "Pending" || submission.verdict === "Judging") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Runtime</div>
                  <div className="text-xl font-bold">{submission.runtime || "--"}</div>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Memory</div>
                  <div className="text-xl font-bold">{submission.memory || "--"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sample Testcase</h3>
                {visibleTestCase ? (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Sample Case</span>
                      {visibleTestCase.result === "passed" ? (
                        <Badge className="bg-green-500/10 text-green-500">Passed</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
                      )}
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Input:</strong> {visibleTestCase.input}
                      </p>
                      <p>
                        <strong>Output:</strong> {visibleTestCase.output}
                      </p>
                      <p>
                        <strong>Expected:</strong> {visibleTestCase.expected}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No sample testcase available.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Submitted Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <MonacoEditor
                  language={submission.language.toLowerCase()}
                  value={submission.content}
                  onChange={() => {}}
                  readOnly={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <Link href={`/problems/${submission.problemId}`}>
          <Button variant="outline">Back to Problem</Button>
        </Link>
        <div className="space-x-2">
          {submission.verdict !== "Accepted" && (
            <Link href={`/problems/${submission.problemId}`}>
              <Button>Try Again</Button>
            </Link>
          )}
          {submission.verdict === "Accepted" && (
            <Link href="/problems">
              <Button>Next Problem</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}