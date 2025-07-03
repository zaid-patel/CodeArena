"use client"


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function ProblemForm({ problemData, setProblemData }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setProblemData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setProblemData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-purple-400">Problem Details</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title</Label>
            <Input
              id="title"
              name="title"
              value={problemData.title}
              onChange={handleChange}
              placeholder="Enter problem title"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={problemData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
              <SelectTrigger id="difficulty" className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700">
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
            <Input
              id="timeLimit"
              name="timeLimit"
              value={problemData.timeLimit}
              onChange={handleChange}
              placeholder="1"
              className="bg-gray-700 border-gray-600"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="score">Max Score</Label>
            <Input
              id="score"
              name="score"
              value={problemData.score}
              onChange={handleChange}
              placeholder="1"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
            <Input
              id="memoryLimit"
              name="memoryLimit"
              value={problemData.memoryLimit}
              onChange={handleChange}
              placeholder="256"
              className="bg-gray-700 border-gray-600"
            />
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-700">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="format">I/O Format</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={problemData.description}
                  onChange={handleChange}
                  placeholder="Describe the problem in detail..."
                  className="min-h-[200px] bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="format" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inputFormat">Input Format</Label>
                <Textarea
                  id="inputFormat"
                  name="inputFormat"
                  value={problemData.inputFormat}
                  onChange={handleChange}
                  placeholder="Describe the input format..."
                  className="min-h-[100px] bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Textarea
                  id="outputFormat"
                  name="outputFormat"
                  value={problemData.outputFormat}
                  onChange={handleChange}
                  placeholder="Describe the output format..."
                  className="min-h-[100px] bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="constraints" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Textarea
                  id="constraints"
                  name="constraints"
                  value={problemData.constraints}
                  onChange={handleChange}
                  placeholder="List all constraints (e.g., 1 ≤ n ≤ 10^5)..."
                  className="min-h-[100px] bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleExplanation">Sample Explanation</Label>
                <Textarea
                  id="sampleExplanation"
                  name="sampleExplanation"
                  value={problemData.sampleExplanation}
                  onChange={handleChange}
                  placeholder="Explain the sample test cases..."
                  className="min-h-[100px] bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">{problemData.title || "Problem Title"}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          problemData.difficulty === "easy"
                            ? "bg-green-800 text-green-200"
                            : problemData.difficulty === "medium"
                              ? "bg-yellow-800 text-yellow-200"
                              : "bg-red-800 text-red-200"
                        }`}
                      >
                        {problemData.difficulty.charAt(0).toUpperCase() + problemData.difficulty.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">Time: {problemData.timeLimit}s</span>
                      <span className="text-xs text-gray-400">Memory: {problemData.memoryLimit}MB</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-300">Description</h4>
                    <p className="mt-1 text-gray-400 whitespace-pre-line">
                      {problemData.description || "No description provided."}
                    </p>
                  </div>

                  {problemData.inputFormat && (
                    <div>
                      <h4 className="font-semibold text-gray-300">Input Format</h4>
                      <p className="mt-1 text-gray-400 whitespace-pre-line">{problemData.inputFormat}</p>
                    </div>
                  )}

                  {problemData.outputFormat && (
                    <div>
                      <h4 className="font-semibold text-gray-300">Output Format</h4>
                      <p className="mt-1 text-gray-400 whitespace-pre-line">{problemData.outputFormat}</p>
                    </div>
                  )}

                  {problemData.constraints && (
                    <div>
                      <h4 className="font-semibold text-gray-300">Constraints</h4>
                      <p className="mt-1 text-gray-400 whitespace-pre-line">{problemData.constraints}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
