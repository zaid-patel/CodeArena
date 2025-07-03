"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TestCaseManager({ testCases, setTestCases }) {
  const [expandedTestCase, setExpandedTestCase] = useState(1)

  const addTestCase = () => {
    if (testCases.length >= 30) {
      alert("Maximum of 30 test cases allowed")
      return
    }

    const newId = Math.max(0, ...testCases.map((tc) => tc.id)) + 1
    const newTestCase = {
      id: newId,
      input: "",
      output: "",
      isSample: false,
    }

    setTestCases([...testCases, newTestCase])
    setExpandedTestCase(newId)
  }

  const removeTestCase = (id) => {
    setTestCases(testCases.filter((tc) => tc.id !== id))
    if (expandedTestCase === id) {
      setExpandedTestCase(null)
    }
  }

  const updateTestCase = (id, field, value) => {
    setTestCases(testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)))
  }

  const moveTestCase = (id, direction) => {
    const index = testCases.findIndex((tc) => tc.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === testCases.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newTestCases = [...testCases]
    const temp = newTestCases[index]
    newTestCases[index] = newTestCases[newIndex]
    newTestCases[newIndex] = temp

    setTestCases(newTestCases)
  }

  return (
    <div>
      <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-400">Test Cases</h2>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            {testCases.length}/30
          </Badge>
          <Button onClick={addTestCase} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Test Case
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4">
          {testCases.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No test cases added yet. Click "Add Test Case" to get started.
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={expandedTestCase ? String(expandedTestCase) : undefined}
              onValueChange={(value) => setExpandedTestCase(value ? Number(value) : null)}
            >
              {testCases.map((testCase, index) => (
                <AccordionItem key={testCase.id} value={String(testCase.id)} className="border-gray-700 mb-3">
                  <div className="bg-gray-700 rounded-t-lg border border-gray-600">
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center">
                        <AccordionTrigger className="hover:no-underline py-0">
                          <span className="font-medium">Test Case {index + 1}</span>
                        </AccordionTrigger>
                        {testCase.isSample && <Badge className="ml-2 bg-purple-600">Sample</Badge>}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveTestCase(testCase.id, "up")
                          }}
                          disabled={index === 0}
                          className="h-7 w-7 text-gray-400 hover:text-white"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveTestCase(testCase.id, "down")
                          }}
                          disabled={index === testCases.length - 1}
                          className="h-7 w-7 text-gray-400 hover:text-white"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeTestCase(testCase.id)
                          }}
                          className="h-7 w-7 text-gray-400 hover:text-white hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <AccordionContent className="pt-0">
                    <div className="border border-t-0 border-gray-600 rounded-b-lg bg-gray-800 p-4">
                      <div className="flex items-center mb-4">
                        <Switch
                          id={`sample-${testCase.id}`}
                          checked={testCase.isSample}
                          onCheckedChange={(checked) => updateTestCase(testCase.id, "isSample", checked)}
                        />
                        <Label htmlFor={`sample-${testCase.id}`} className="ml-2">
                          Sample test case (visible to users)
                        </Label>
                      </div>

                      <Tabs defaultValue="input" className="w-full">
                        <TabsList className="grid grid-cols-2 bg-gray-700">
                          <TabsTrigger value="input">Input</TabsTrigger>
                          <TabsTrigger value="output">Output</TabsTrigger>
                        </TabsList>

                        <TabsContent value="input" className="mt-4">
                          <Textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                            placeholder="Enter input for this test case..."
                            className="min-h-[150px] font-mono text-sm bg-gray-700 border-gray-600"
                          />
                        </TabsContent>

                        <TabsContent value="output" className="mt-4">
                          <Textarea
                            value={testCase.output}
                            onChange={(e) => updateTestCase(testCase.id, "output", e.target.value)}
                            placeholder="Enter expected output for this test case..."
                            className="min-h-[150px] font-mono text-sm bg-gray-700 border-gray-600"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
