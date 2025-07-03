"use client"

import { useState } from "react"
import ProblemForm from "@/components/problem-form"
import TestCaseManager from "@/components/test-case-manager"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/config"
import axios from "axios"

// Your Prisma schema fields for Problem:
// title, difficulty, score, description, inputDescription, outputDescription, constraints, exampleTestcase, tags

export default function ProblemSetter() {
  const [problemData, setProblemData] = useState({
    title: "",
    difficulty: "Medium", // Must match Difficulty enum ("Easy"|"Medium"|"Hard")
    score: 0,
    description: "",
    inputDescription: "",
    outputDescription: "",
    constraints: "",
    tags: ["general"],
  })

  const router = useRouter()

  // Each testcase: { input: string, output: string, isSample: boolean }
  // For Prisma: exampleTestcase: string[], and first example is sample
  const [testCases, setTestCases] = useState([
    { id: 1, input: "", output: "", isSample: true }
  ])

  const handleExport = () => {
    const exportData = {
      ...problemData,
      exampleTestcase: testCases.map(tc => `${tc.input.trim()}|${tc.output.trim()}`),
      tags: problemData.tags,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${problemData.title.replace(/\s+/g, "_").toLowerCase() || "problem"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...problemData,
        // Only include input, output, and mark all example testcases as strings "input|output"
        testCases,
        // inputDescription
        tags: problemData.tags,
        // The fields below are handled by backend/prisma: attemptCount, acceptedCount, author, etc.
      }
      // POST to your backend (make sure the backend expects these fields)
      console.log(payload);
      
      const problem = await axios.post(`${BACKEND_URL}/problems/`, payload)
      console.log(problem)
      // router.push('/problems')
    } catch (err) {
      console.error("Error creating problem:", err)
      // Optionally show a toast/error message here
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-purple-400">Problem Setter</h1>
          </div>
          <p className="text-gray-400 mt-2">Create competitive programming problems with test cases</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProblemForm problemData={problemData} setProblemData={setProblemData} />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Actions</h2>
              <div className="space-y-3">
                <Button onClick={handleExport} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Download className="mr-2 h-4 w-4" />
                  Export Problem
                </Button>
                <Button className="w-full" onClick={handleSubmit}>Create</Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <TestCaseManager testCases={testCases} setTestCases={setTestCases} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}