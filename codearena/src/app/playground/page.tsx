"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import CodePlayground from "@/components/code-playground"

export default function PlaygroundPage() {
  const { toast } = useToast()
  const [output, setOutput] = useState<string>("")

  // Sample starter code for different languages
  const starterCode = {
    javascript: `// JavaScript starter code
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// Test the function
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));`,

    python: `# Python starter code
def two_sum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []

# Test the function
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`,

    java: `// Java starter code
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
    
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }
}`,

    cpp: `// C++ starter code
#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        
        map[nums[i]] = i;
    }
    
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    std::vector<int> result = twoSum(nums, target);
    
    std::cout << "[" << result[0] << ", " << result[1] << "]" << std::endl;
    
    return 0;
}`,
  }

  const handleRunCode = (code: string, language: string) => {
    // In a real application, this would send the code to a backend for execution
    // For this demo, we'll just simulate execution

    setOutput("Running code...\n")

    setTimeout(() => {
      if (language === "javascript") {
        setOutput("Output:\n[0, 1]\n\nExecution completed successfully.")
      } else if (language === "python") {
        setOutput("Output:\n[0, 1]\n\nExecution completed successfully.")
      } else if (language === "java") {
        setOutput("Output:\n[0, 1]\n\nExecution completed successfully.")
      } else if (language === "cpp") {
        setOutput("Output:\n[0, 1]\n\nExecution completed successfully.")
      } else {
        setOutput(`Language '${language}' execution simulated.\nOutput: [0, 1]`)
      }

      toast({
        title: "Code executed",
        description: "Your code ran successfully!",
      })
    }, 1500)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Code Playground</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="javascript">
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="cpp">C++</TabsTrigger>
            </TabsList>

            <TabsContent value="javascript">
              <CodePlayground
                initialCode={starterCode.javascript}
                initialLanguage="javascript"
                onRun={handleRunCode}
                height="600px"
              />
            </TabsContent>

            <TabsContent value="python">
              <CodePlayground
                initialCode={starterCode.python}
                initialLanguage="python"
                onRun={handleRunCode}
                height="600px"
              />
            </TabsContent>

            <TabsContent value="java">
              <CodePlayground
                initialCode={starterCode.java}
                initialLanguage="java"
                onRun={handleRunCode}
                height="600px"
              />
            </TabsContent>

            <TabsContent value="cpp">
              <CodePlayground
                initialCode={starterCode.cpp}
                initialLanguage="cpp"
                onRun={handleRunCode}
                height="600px"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>Execution results will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md h-[500px] overflow-auto whitespace-pre-wrap">
                {output || "Run your code to see output here..."}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
