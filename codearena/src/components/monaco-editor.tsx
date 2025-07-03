"use client"

import { Editor } from "@monaco-editor/react"
import { Loader2 } from "lucide-react"

interface MonacoEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

export default function MonacoEditor({
  language,
  value,
  onChange,
  height = "500px",
  readOnly = false,
}: MonacoEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "")
  }

  return (
    <div className="relative w-full border rounded-md overflow-hidden" style={{ height }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          readOnly,
          scrollbar: {
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            alwaysConsumeMouseWheel: false,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
            showWords: true,
          },
        }}
      />
    </div>
  )
}