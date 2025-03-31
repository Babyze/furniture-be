#!/bin/bash

echo "🚀 Updating system..."
sudo apt update -y && sudo apt upgrade -y

# Cài đặt Docker
echo "🐳 Installing Docker..."
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

if [ ! -d "express-app" ]; then
    echo "📥 Cloning project..."
    git clone https://github.com/Babyze/furniture-be.git
fi

echo "🚀 Running Docker Compose..."
docker-compose up --build -d

echo "✅ Setup completed! Your application is running."
