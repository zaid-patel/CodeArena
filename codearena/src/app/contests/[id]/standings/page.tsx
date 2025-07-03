"use client"
import Link from "next/link"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowUp,
  Clock,
  Medal,
  Trophy,
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
// @ts-ignore
import { BACKEND_URL } from "@/lib/utils"
import { useParams } from "next/navigation"
// @ts-ignore
import { getContestDuration } from "@/lib/contest-time-utils"
import { differenceInSeconds } from "date-fns"

export default function ContestStandingsPage({ params }: { params: { id: string } }) {
  const [contest, setContest] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10; // You can make this user-selectable
  const [totalParticipants, setTotalParticipants] = useState(0);

  const contestId = useParams().id;

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/contest/rankings/${contestId}?oage=${page}&cnt=${perPage}`,
          {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }
        );
        setStandings(res.data.ranking);
        setContest(res.data.contest);
        // console.log(res.data.contest);
        
        setTotalParticipants(res.data.contest.participants.length);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching contest details:", error);
        setLoading(false)
      }
    }
    fetchContestDetails();
  }, [contestId, page]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Trophy className="h-4 w-4 mr-1" />
            1st
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-gray-400/10 text-gray-400">
            <Medal className="h-4 w-4 mr-1" />
            2nd
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-amber-700/10 text-amber-700">
            <Medal className="h-4 w-4 mr-1" />
            3rd
          </Badge>
        )
      default:
        return <span>{rank}th</span>
    }
  }

  // Converts seconds to HH:MM:SS format
  const formatSeconds = (seconds: number | null | undefined) => {
    if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) return "-";
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return [h, m, s]
      .map(v => v < 10 ? `0${v}` : `${v}`)
      .join(":")
  }

  // Gets elapsed seconds between start and finalTime
  const getElapsedSinceStart = (finalTime: string, startTime: string) => {
    if (!finalTime || !startTime) return "-";
    const start = new Date(startTime)
    const end = new Date(finalTime)
    const secs = differenceInSeconds(end, start)
    return formatSeconds(secs)
  }

  const getProblemCell = (problem: any) => {
    return (
      <div className="space-y-1 flex flex-col items-center">
        <div className="flex items-center gap-1">
          {problem.solved ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" title="Solved" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" title="Not solved" />
          )}
          {problem.solved && (
            <span className="text-green-600 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatSeconds(problem.timeTaken)}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {problem.attempts} {problem.attempts === 1 ? "attempt" : "attempts"}
        </div>
      </div>
    )
  }

  // Helper to format date/time from ISO string
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  const formatTime = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  let durationStr = ""
  if (contest && contest.startTime && contest.endTime) {
    durationStr = getContestDuration(new Date(contest.startTime), new Date(contest.endTime))
  }

  const totalPages = Math.max(1, Math.ceil(totalParticipants / perPage));
  const showingStart = (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, totalParticipants);

  if (loading || !contest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-muted-foreground">Loading contest standings...</div>
      </div>
    )
  }
  return (
    <div className="container py-8">
      {/* Contest Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h1 className="text-2xl font-bold">{contest.title} - Standings</h1>
           <Link href={`/contests/${contestId}`}>
          <Button variant="outline">Back to Contest</Button>
        </Link>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
            <span>
              {formatDate(contest.startTime)} at {formatTime(contest.startTime)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <span>{durationStr}</span>
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                    <div className="flex items-center gap-1">
                      Rank
                      <ArrowUp className="h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                    Score
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                    Final Time
                  </th>
                  {contest.problems.map((problem: any) => (
                    <th key={problem.id} scope="col" className="px-4 py-3 text-center text-sm font-medium">
                      <Link href={`/contests/${contest.id}/problems/${problem.id}`} className="hover:text-primary">
                        Problem {problem.id}
                        <div className="text-xs text-muted-foreground">{problem.score} pts</div>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {standings?.map((user, index) => (
                  <tr key={user?.user.username} className="hover:bg-muted/50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{getRankBadge((page - 1) * perPage + index + 1)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                      <Link href={`/profile/${user.user.username}`} className="hover:text-primary">
                        {user.user.username}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold">{user.score}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-mono">
                      {getElapsedSinceStart(user.finalTime, contest.startTime)}
                    </td>
                    {user.problemStats.map((problem: any, i: number) => (
                      <td key={i} className="whitespace-nowrap px-4 py-3 text-sm text-center">
                        {getProblemCell(problem)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{showingStart}-{showingEnd}</strong> of <strong>{totalParticipants}</strong> participants
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 2, page - 1)) + i;
            if (pageNum > totalPages) return null;
            return (
              <Button
                key={pageNum}
                variant="outline"
                size="sm"
                className={page === pageNum ? "bg-primary/10" : ""}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
          {totalPages > 3 && <span>...</span>}
          {totalPages > 3 &&
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)}>
              {totalPages}
            </Button>
          }
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}