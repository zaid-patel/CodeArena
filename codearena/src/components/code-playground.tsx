"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Play, Save } from "lucide-react"
import MonacoEditor from "@/components/monaco-editor"

interface CodePlaygroundProps {
  initialCode?: string
  initialLanguage?: string
  onRun?: (code: string, language: string) => void
  onSave?: (code: string, language: string) => void
  readOnly?: boolean
  height?: string
}

export default function CodePlayground({
  initialCode = "// Write your code here\n",
  initialLanguage = "javascript",
  onRun,
  onSave,
  readOnly = false,
  height = "500px",
}: CodePlaygroundProps) {
  const { toast } = useToast()
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [isRunning, setIsRunning] = useState(false)

  // Update code when initialCode changes
  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  // Update language when initialLanguage changes
  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

  const handleRun = () => {
    if (onRun) {
      setIsRunning(true)

      toast({
        title: "Running code",
        description: "Executing your code...",
      })

      try {
        onRun(code, language)
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while running your code",
          variant: "destructive",
        })
      } finally {
        setIsRunning(false)
      }
    } else {
      // Default behavior if no onRun provided
      toast({
        title: "Running code",
        description: "This is a demo. In a real app, your code would be executed.",
      })

      // Simulate execution delay
      setTimeout(() => {
        toast({
          title: "Code executed",
          description: "Your code ran successfully!",
          variant: "success",
        })
      }, 1500)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(code, language)
    } else {
      // Default behavior if no onSave provided
      toast({
        title: "Code saved",
        description: "Your code has been saved successfully.",
      })
    }
  }

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            {!readOnly && (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!readOnly && onRun && (
              <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning}>
                {isRunning ? (
                  <>Running...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
            )}
            {!readOnly && onSave && (
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MonacoEditor language={language} value={code} onChange={setCode} height={height} readOnly={readOnly} />
      </CardContent>
    </Card>
  )
}
