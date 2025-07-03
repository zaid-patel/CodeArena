#!/bin/bash


#   basic  
cd /app


javac Main.java 2> compile_errors.txt
if [ $? -ne 0 ]; then
  echo "Compilation Error:"
  cat compile_errors.txt
  exit 1
fi

if [ ! -f Main.class ]; then
  echo "Compilation did not produce Main.class!"
  exit 1
fi

# Run
timeout 5 java -cp . Main < input.txt > output.txt 2> runtime_errors.txt

if [ $? -ne 0 ]; then
  echo "Runtime Error:"
  cat runtime_errors.txt
  exit 1
fi


cat output.txt
