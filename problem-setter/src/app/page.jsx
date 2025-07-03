"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileText, Trophy } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-purple-400">CodeCraft</h1>
          <p className="text-gray-400 mt-2">Create and manage competitive programming problems and contests</p>
        </header>

        <Tabs defaultValue="dashboard" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full bg-gray-800">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/problems/create" className="block">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition-colors border border-gray-700 h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-900/50 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold ml-3 text-purple-400">Problems</h2>
                  </div>
                  <p className="text-gray-400 mb-4">Create, edit and manage your competitive programming problems.</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Problem
                  </Button>
                </div>
              </Link>

              <Link href="/contests" className="block">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition-colors border border-gray-700 h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-900/50 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold ml-3 text-purple-400">Contests</h2>
                  </div>
                  <p className="text-gray-400 mb-4">Organize your problems into contests and competitions.</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Contest
                  </Button>
                </div>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="getting-started" className="mt-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Welcome to CodeCraft</h2>
              <p className="text-gray-400 mb-4">
                CodeCraft helps you create and manage competitive programming problems and contests. Here's how to get
                started:
              </p>

              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>
                  <span className="font-medium">Create Problems</span> - Start by creating problems with detailed
                  descriptions and test cases
                </li>
                <li>
                  <span className="font-medium">Organize Contests</span> - Group your problems into contests with
                  customizable settings
                </li>
                <li>
                  <span className="font-medium">Export</span> - Export your problems and contests for use in your
                  preferred judging system
                </li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
