"use client"

import Link from "next/link"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Trophy, Users } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
// @ts-ignore
import { BACKEND_URL } from "@/lib/utils"
// @ts-ignore
import { getContestDuration } from "@/lib/contest-time-utils" 

export default function ContestsPage() {
  // Mock data for upcoming contests
  const [upcomingContests, setUpcomingContests] = useState([
    {
      id: 1,
      title: "Weekly Contest #123",
      startTime: "2025-05-25T20:00:00.000Z",
      endTime: "2025-05-25T22:00:00.000Z",
      participants: 1245,
      difficulty: "Medium",
      description: "Solve algorithmic problems and compete with coders worldwide in our weekly contest.",
    },
    {
      id: 2,
      title: "Biweekly Contest #45",
      startTime: "2025-05-28T21:00:00.000Z",
      endTime: "2025-05-28T22:30:00.000Z",
      participants: 876,
      difficulty: "Easy",
      description: "A shorter contest with easier problems, perfect for beginners and intermediate coders.",
    },
    {
      id: 3,
      title: "CodeArena Championship",
      startTime: "2025-06-05T19:00:00.000Z",
      endTime: "2025-06-05T22:00:00.000Z",
      participants: 2134,
      difficulty: "Hard",
      description: "Our monthly championship with challenging problems and great prizes for top performers.",
    },
  ]);

  // Mock data for past contests
  const [pastContests, setPastContests] = useState([
    {
      id: 101,
      title: "Weekly Contest #122",
      startTime: "2025-05-18T20:00:00.000Z",
      endTime: "2025-05-18T22:00:00.000Z",
      participants: 1356,
      difficulty: "Medium",
      winner: "codingmaster",
    },
    {
      id: 102,
      title: "Biweekly Contest #44",
      startTime: "2025-05-14T21:00:00.000Z",
      endTime: "2025-05-14T22:30:00.000Z",
      participants: 945,
      difficulty: "Easy",
      winner: "algorithmexpert",
    },
    {
      id: 103,
      title: "Spring Coding Challenge",
      startTime: "2025-05-10T15:00:00.000Z",
      endTime: "2025-05-10T19:00:00.000Z",
      participants: 2567,
      difficulty: "Hard",
      winner: "pythonista",
    },
    {
      id: 104,
      title: "Weekly Contest #121",
      startTime: "2025-05-11T20:00:00.000Z",
      endTime: "2025-05-11T22:00:00.000Z",
      participants: 1289,
      difficulty: "Medium",
      winner: "javascriptpro",
    },
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/contest/segregated`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        if (response?.status === 200) {
          setUpcomingContests((prev) => [
            ...prev,
            ...(response.data.contests || []),
          ]);
          setPastContests((prev) => [
            ...prev,
            ...(response.data.pastContests || []),
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20";
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Contests</h1>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingContests?.map((contest, index) =>
              contest && contest?.title ? (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl">{contest?.title}</CardTitle>
                    <CardDescription>
                      <Badge className={getDifficultyColor(contest.difficulty || "medium")}>
                        {contest.difficulty}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{contest.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                        <span>
                          {formatDate(contest.startTime)} at {formatTime(contest.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 opacity-70" />
                        <span>
                          {getContestDuration(new Date(contest.startTime), new Date(contest.endTime)) || "2 hours"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 opacity-70" />
                        <span>{contest.participants} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/contests/${contest.id}/register`} className="w-full">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ) : null
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Contest</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Duration</th>
                  <th className="px-4 py-3 text-left font-medium">Difficulty</th>
                  <th className="px-4 py-3 text-left font-medium">Winner</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastContests.map((contest, index) => (
                  <tr key={index} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/contests/${contest.id}`} className="hover:text-primary">
                        {contest.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(contest.startTime)} at {formatTime(contest.startTime)}
                    </td>
                    <td className="px-4 py-3">
                      {getContestDuration(new Date(contest.startTime), new Date(contest.endTime))}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getDifficultyColor(contest?.difficulty || "easy")}>
                        {contest.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                        <Link href={`/profile/${contest.winner}`} className="hover:text-primary">
                          {contest.winner}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/contests/${contest.id}/problems`}>
                          <Button variant="outline" size="sm">
                            Problems
                          </Button>
                        </Link>
                        <Link href={`/contests/${contest.id}/standings`}>
                          <Button variant="outline" size="sm">
                            Standings
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}