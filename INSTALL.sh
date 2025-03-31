#!/bin/bash

echo "🐳 Installing Docker..."
sudo yum install docker
sudo service docker start
sudo usermod -a -G docker ec2-user

echo "🚀 Running Docker Compose..."
sudo docker-compose up --build -d

echo "✅ Setup completed! Your application is running."
