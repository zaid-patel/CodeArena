"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"
import { useParams } from "next/navigation"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BACKEND_URL}/submission/`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })

        
        setSubmissions(res.data || [])
      } catch (err) {
        setSubmissions([])
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [token])

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Accepted
          </Badge>
        )
      case "Wrong_Answer":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <XCircle className="h-4 w-4 mr-1" /> Wrong Answer
          </Badge>
        )
      case "TLE":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Clock className="h-4 w-4 mr-1" /> Time Limit Exceeded
          </Badge>
        )
      case "MLE":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">
            <Clock className="h-4 w-4 mr-1" /> Memory Limit Exceeded
          </Badge>
        )
      case "Compilation_Error":
        return (
          <Badge className="bg-orange-500/10 text-orange-500">
            <XCircle className="h-4 w-4 mr-1" /> Compilation Error
          </Badge>
        )
      case "Runtime_Error":
        return (
          <Badge className="bg-pink-500/10 text-pink-500">
            <XCircle className="h-4 w-4 mr-1" /> Runtime Error
          </Badge>
        )
      case "Pending":
      case "Judging":
        return (
          <Badge className="bg-gray-400/10 text-gray-400 animate-pulse">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> {verdict}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">{verdict}</Badge>
        )
    }
  }

  const formatTime = (iso: string) => {
    if (!iso) return "-"
    const date = new Date(iso)
    return (
      date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
      " " +
      date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Submissions</h1>
       
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-lg text-muted-foreground">Loading submissions...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Official</TableHead>
                <TableHead>Problem ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No submissions.
                  </TableCell>
                </TableRow>
              )}
              {submissions.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="cursor-pointer hover:bg-muted/50 transition"
                  onClick={() => window.location.href = `/submissions/${sub.id}`}
                >
                  <TableCell className="font-mono font-medium">{sub.id}</TableCell>
                  <TableCell>{formatTime(sub.time)}</TableCell>
                  <TableCell>{getVerdictBadge(sub.verdict)}</TableCell>
                  <TableCell>
                    {sub.official
                      ? <Badge className="bg-blue-500/10 text-blue-500">Official</Badge>
                      : <Badge variant="outline">Unofficial</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <Link href={`/problems/${sub.problemId}`} className="underline hover:text-primary">
                      {sub.problemId}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}