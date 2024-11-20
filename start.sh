#!/bin/bash
MONGODB_DIR=`pwd`
docker stop mongodb
docker rm mongodb
docker run -d \\
    --name mongodb \\
    --restart always \\
    --privileged \\
    -p 27017:27017 \\
    -v \${MONGODB_DIR}/data:/data/db \\
    -e MONGO_INITDB_ROOT_USERNAME=admin \\
    -e MONGO_INITDB_ROOT_PASSWORD=admin123 \\
    mongo:latest mongosh --auth