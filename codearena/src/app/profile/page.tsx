import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Clock, Code, Medal, Trophy, XCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  // Mock user data
  const user = {
    username: "codingmaster",
    fullName: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "January 15, 2023",
    avatar: "/placeholder.svg?height=100&width=100",
    rank: 1245,
    rating: 1876,
    badges: ["Contest Winner", "100 Day Streak", "Problem Setter"],
  }

  // Mock statistics
  const stats = {
    solved: 342,
    attempted: 412,
    submissions: 587,
    acceptanceRate: 78,
    streak: 45,
    contests: 23,
    bestRank: 87,
  }

  // Mock problem solving progress
  const progress = {
    easy: { solved: 210, total: 250 },
    medium: { solved: 120, total: 450 },
    hard: { solved: 12, total: 200 },
  }

  // Mock recent submissions
  const recentSubmissions = [
    {
      id: 1,
      problem: "Two Sum",
      problemId: 101,
      status: "Accepted",
      language: "JavaScript",
      runtime: "76 ms",
      memory: "42.1 MB",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      problem: "Valid Parentheses",
      problemId: 104,
      status: "Wrong Answer",
      language: "Python",
      runtime: "N/A",
      memory: "N/A",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      problem: "Merge Two Sorted Lists",
      problemId: 105,
      status: "Accepted",
      language: "Java",
      runtime: "0 ms",
      memory: "39.8 MB",
      timestamp: "Yesterday",
    },
    {
      id: 4,
      problem: "Maximum Subarray",
      problemId: 106,
      status: "Time Limit Exceeded",
      language: "C++",
      runtime: "N/A",
      memory: "N/A",
      timestamp: "2 days ago",
    },
    {
      id: 5,
      problem: "Binary Tree Level Order Traversal",
      problemId: 107,
      status: "Accepted",
      language: "JavaScript",
      runtime: "84 ms",
      memory: "44.3 MB",
      timestamp: "3 days ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "wrong answer":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "time limit exceeded":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "wrong answer":
      case "time limit exceeded":
        return <XCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.username}</CardTitle>
            <CardDescription>{user.fullName}</CardDescription>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              Joined {user.joinDate}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Rank</div>
                <div className="font-medium flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                  {user.rank}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Rating</div>
                <div className="font-medium flex items-center">
                  <Medal className="h-4 w-4 mr-1 text-primary" />
                  {user.rating}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <Button className="w-full mt-4">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex items-center">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  Solved
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{stats.solved}</div>
                <p className="text-xs text-muted-foreground">out of {stats.attempted} attempted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Acceptance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
                <p className="text-xs text-muted-foreground">{stats.submissions} total submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{stats.streak} days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{stats.contests}</div>
                <p className="text-xs text-muted-foreground">Best rank: {stats.bestRank}</p>
              </CardContent>
            </Card>
          </div>

          {/* Problem Solving Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Solving Progress</CardTitle>
              <CardDescription>Track your progress across different difficulty levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Easy</div>
                  <div className="text-sm text-muted-foreground">
                    {progress.easy.solved} / {progress.easy.total}
                  </div>
                </div>
                <Progress value={(progress.easy.solved / progress.easy.total) * 100} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Medium</div>
                  <div className="text-sm text-muted-foreground">
                    {progress.medium.solved} / {progress.medium.total}
                  </div>
                </div>
                <Progress value={(progress.medium.solved / progress.medium.total) * 100} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Hard</div>
                  <div className="text-sm text-muted-foreground">
                    {progress.hard.solved} / {progress.hard.total}
                  </div>
                </div>
                <Progress value={(progress.hard.solved / progress.hard.total) * 100} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Your latest problem submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="wrong">Wrong Answers</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Problem</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Language</th>
                          <th className="px-4 py-3 text-left font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions.map((submission) => (
                          <tr key={submission.id} className="border-t hover:bg-muted/50">
                            <td className="px-4 py-3">
                              <Link
                                href={`/problems/${submission.problemId}`}
                                className="font-medium hover:text-primary"
                              >
                                {submission.problem}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={getStatusColor(submission.status)}>
                                <span className="flex items-center">
                                  {getStatusIcon(submission.status)}
                                  {submission.status}
                                </span>
                              </Badge>
                            </td>
                            <td className="px-4 py-3">{submission.language}</td>
                            <td className="px-4 py-3 text-muted-foreground">{submission.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="accepted">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Problem</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Language</th>
                          <th className="px-4 py-3 text-left font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions
                          .filter((s) => s.status === "Accepted")
                          .map((submission) => (
                            <tr key={submission.id} className="border-t hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <Link
                                  href={`/problems/${submission.problemId}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {submission.problem}
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={getStatusColor(submission.status)}>
                                  <span className="flex items-center">
                                    {getStatusIcon(submission.status)}
                                    {submission.status}
                                  </span>
                                </Badge>
                              </td>
                              <td className="px-4 py-3">{submission.language}</td>
                              <td className="px-4 py-3 text-muted-foreground">{submission.timestamp}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="wrong">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Problem</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Language</th>
                          <th className="px-4 py-3 text-left font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions
                          .filter((s) => s.status !== "Accepted")
                          .map((submission) => (
                            <tr key={submission.id} className="border-t hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <Link
                                  href={`/problems/${submission.problemId}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {submission.problem}
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={getStatusColor(submission.status)}>
                                  <span className="flex items-center">
                                    {getStatusIcon(submission.status)}
                                    {submission.status}
                                  </span>
                                </Badge>
                              </td>
                              <td className="px-4 py-3">{submission.language}</td>
                              <td className="px-4 py-3 text-muted-foreground">{submission.timestamp}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-4 text-center">
                <Button variant="outline">View All Submissions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
