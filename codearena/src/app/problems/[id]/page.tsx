"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Users, Play, FileText, MessageSquare, Code, BookOpen } from "lucide-react"
import Link from "next/link"
import MonacoEditor from "@/components/monaco-editor"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { useParams } from "next/navigation"

export default function ProblemPage() {
  const { toast } = useToast()
  const [code, setCode] = useState("// Write your code here\n")
  const [language, setLanguage] = useState("java")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const [lastSubmissionId, setLastSubmissionId] = useState<number | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const id = params.id

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BACKEND_URL}/problems/${id}`)
        // Schema adapt: ensure correct field mapping
        setProblem(res.data.data.problem)


        console.log(res.data.data.problem);
        
      } catch (err) {
        toast({
          title: "Failed to load problem",
          description: "Could not fetch problem data from server.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProblem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!lastSubmissionId) return

    const pollStatus = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/submission/status/${lastSubmissionId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        setSubmissionStatus(res.data)
        if (res.data !== "Pending" && res.data !== "Judging") {
          if (pollingRef.current) clearInterval(pollingRef.current)
        }
      } catch (err) {
        // Optionally handle error
      }
    }

    pollingRef.current = setInterval(pollStatus, 10000)
    pollStatus()

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [lastSubmissionId])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/submission/add`, {
        code,
        language,
        problemId: Number(id),
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      if (response?.status === 200 && response.data.id) {
        setLastSubmissionId(response.data.id)
        setSubmissionStatus("Pending")
        setIsSubmitting(false)
        toast({
          title: "Submission successful",
          description: "Your code was submitted for judging.",
          variant: "success",
        })
      }
    } catch {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your code.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleRun = () => {
    toast({
      title: "Running code",
      description: "Testing your solution with the sample case...",
    })
    setTimeout(() => {
      toast({
        title: "Test results",
        description: "Sample test case executed!",
      })
    }, 1500)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (String(difficulty).toLowerCase()) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        Loading problem...
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        Problem not found.
      </div>
    )
  }

  // Adapt: Use exampleTestcase (array of strings "input|output" as per your schema)
  const examples = Array.isArray(problem.exampleTestcase)
    ? problem.exampleTestcase.map((ex: string) => {
        const [input, output] = ex.split("|")
        return { input, output }
      })
    : []

  return (
    <div className="container py-8">
      {/* Problem Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/gym">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <Badge className={getDifficultyColor(problem.difficulty || "easy")}>{problem.difficulty}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {typeof problem.acceptedCount === "number" && (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              {problem.acceptedCount} Accepted
            </div>
          )}
          {typeof problem.attemptCount === "number" && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {problem.attemptCount} Submissions
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Problem Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{problem.description}</ReactMarkdown>

                {problem.inputDescription && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Input</h3>
                    <ReactMarkdown>{problem.inputDescription}</ReactMarkdown>
                  </>
                )}
                {problem.outputDescription && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Output</h3>
                    <ReactMarkdown>{problem.outputDescription}</ReactMarkdown>
                  </>
                )}

                {examples.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Examples:</h3>
                    {examples.map((example, index) => (
                      <div key={index} className="my-4 p-4 bg-muted rounded-md">
                        <p>
                          <strong>Input:</strong> <span className="whitespace-pre">{example.input}</span>
                        </p>
                        <p>
                          <strong>Output:</strong> <span className="whitespace-pre">{example.output}</span>
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {problem.constraints && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Constraints:</h3>
                    <ul className="list-disc pl-6">
                      {(Array.isArray(problem.constraints) ? problem.constraints : [problem.constraints]).map(
                        (constraint: string, index: number) => (
                          <li key={index}>{constraint}</li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRun} disabled={isSubmitting}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>

          <Card className="h-[calc(100vh-20rem)]">
            <CardContent className="p-0 h-full">
              <MonacoEditor language={language} value={code} onChange={setCode} height="100%" />
            </CardContent>
          </Card>

          <Tabs defaultValue="testcases">
            <TabsList className="w-full">
              <TabsTrigger value="testcases" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Test Cases
              </TabsTrigger>
              <TabsTrigger value="discussion" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="solutions" className="flex-1">
                <Code className="h-4 w-4 mr-2" />
                Solutions
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="testcases" className="border rounded-md mt-2 p-4">
              <div className="space-y-4">
                {examples.length > 0 &&
                  examples.map((example, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Example {index + 1}</span>
                        <Button variant="ghost" size="sm">
                          Test
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Input:</strong> <span className="whitespace-pre">{example.input}</span>
                        </p>
                        <p>
                          <strong>Expected Output:</strong> <span className="whitespace-pre">{example.output}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                <Button variant="outline" className="w-full">
                  Add Custom Test Case
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="discussion" className="border rounded-md mt-2 p-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Join the Discussion</h3>
                <p className="text-muted-foreground mb-4">Share your approach or ask questions about this problem</p>
                <Button>View Discussions</Button>
              </div>
            </TabsContent>
            <TabsContent value="solutions" className="border rounded-md mt-2 p-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Community Solutions</h3>
                <p className="text-muted-foreground mb-4">
                  View solutions from other users after you solve the problem
                </p>
                <Button>View Solutions</Button>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="border rounded-md mt-2 p-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Your Notes</h3>
                <p className="text-muted-foreground mb-4">Keep track of your thoughts and approaches</p>
                <Button>Add Note</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}