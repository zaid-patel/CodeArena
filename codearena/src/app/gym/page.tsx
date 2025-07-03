"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, CheckCircle2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"

type Problem = {
  id: number
  title: string
  difficulty: string
  solvedCount: number
  category: string
  tags: string[]
}

export default function GymPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedProblems, setSolvedProblems] = useState<number[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<string>("all")
  const [category, setCategory] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      try {
        // Compose params for filters and pagination
        const params: any = {
          page,
          pageSize,
        }
        if (difficulty !== "all") params.difficulty = difficulty
        if (category !== "all") params.category = category
        if (status !== "all") params.status = status
        if (search.trim()) params.search = search.trim()

        const res = await axios.get(`${BACKEND_URL}/problems`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setProblems(res.data)
        // If your backend returns solvedProblems ids along with problems
        
        setSolvedProblems(res.data)
        
      } catch (err) {
        setProblems([])
        setSolvedProblems([])
      }
      setLoading(false)
    }
    fetchProblems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, difficulty, category, status, search])

  useEffect(() => {
    setFilteredProblems(problems)
  }, [problems])

  const getDifficultyColor = (difficulty: string) => {
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

  // Handlers for filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value)
    setPage(1)
  }
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
  }
  const handleStatusChange = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  // Example: backend could return total count for pagination
  const totalProblems = 120 // TODO: Replace with res.data.total if available

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Problem Gym</h1>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search" className="mb-2 block">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search problems..."
              className="pl-8"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="difficulty" className="mb-2 block">
            Difficulty
          </Label>
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category" className="mb-2 block">
            Category
          </Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="arrays">Arrays</SelectItem>
              <SelectItem value="strings">Strings</SelectItem>
              <SelectItem value="linked-list">Linked List</SelectItem>
              <SelectItem value="trees">Trees</SelectItem>
              <SelectItem value="graphs">Graphs</SelectItem>
              <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status" className="mb-2 block">
            Status
          </Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="attempted">Attempted</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Difficulty</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Tags</th>
              <th className="px-4 py-3 text-left font-medium">Solved</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  Loading problems...
                </td>
              </tr>
            ) : filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  No problems found.
                </td>
              </tr>
            ) : (
              filteredProblems.map((problem) => (
                <tr key={problem.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link href={`/problems/${problem.id}`} className="font-medium hover:text-primary">
                      {problem.title}
                    </Link>
                    {problem.isSolved && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Solved" title="Solved" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  </td>
                  <td className="px-4 py-3">{problem.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{problem.solvedCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalProblems)}</strong> of <strong>{totalProblems}</strong> problems
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          {[...Array(3)].map((_, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className={page === idx + 1 ? "bg-primary/10" : ""}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
          <span>...</span>
          <Button variant="outline" size="sm" onClick={() => setPage(12)}>
            12
          </Button>
          <Button variant="outline" size="sm" disabled={page === 12} onClick={() => setPage((p) => Math.min(12, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}