FROM openjdk:17-jdk-slim


#   for more secure access
# RUN useradd -m judgeuser
# USER judgeuser   



# Install Node.js 
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


WORKDIR /app


COPY . /app/


RUN npm install



CMD ["node", "judge.js"]



#   to run: 
    # docker build -t java-runner .
    # docker run --rm -v "${PWD}:/app" java-runner
    # --rm : remove container once done
    #  -v "${PWD}:/app" :  move curr directory to /app in container


    #  safer :   docker run --rm \
#   --user $(id -u):$(id -g) \                    # Run container as your current user (avoid root in container)
#   --memory=256m \                              # Limit memory usage to 256 MB
#   --cpus=1 \                                   # Limit CPU usage to 1 core
#   --pids-limit=100 \                           # Limit number of processes inside container
#   --network=none \                             # Disable all networking inside container
#   --read-only \                                # Make filesystem read-only (except volumes)
#   -v "${PWD}:/app:ro" \                        # Mount code directory read-only (adjust if write needed)
#   java-runner
 


