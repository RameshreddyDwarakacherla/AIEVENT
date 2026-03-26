#!/bin/bash

echo "🚀 AI Event Planner Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_status "Building production bundle..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build completed"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    print_success "Backend setup completed"
    cd ..
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_status "Building and starting containers..."
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        print_success "Docker deployment completed"
        print_status "Application is running at:"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend: http://localhost:5000"
    else
        print_error "Docker deployment failed"
        exit 1
    fi
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd frontend
    vercel --prod
    cd ..
    
    print_success "Vercel deployment initiated"
}

# Deploy to Railway (Backend)
deploy_railway() {
    print_status "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    cd backend
    railway up
    cd ..
    
    print_success "Railway deployment initiated"
}

# Main deployment menu
main_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Local Docker deployment"
    echo "2) Vercel (Frontend) + Railway (Backend)"
    echo "3) Build only (no deployment)"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            check_requirements
            build_frontend
            setup_backend
            deploy_docker
            ;;
        2)
            check_requirements
            build_frontend
            setup_backend
            deploy_vercel
            deploy_railway
            ;;
        3)
            check_requirements
            build_frontend
            setup_backend
            print_success "Build completed successfully"
            ;;
        4)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option"
            main_menu
            ;;
    esac
}

# Check if .env files exist
check_env_files() {
    print_status "Checking environment files..."
    
    if [ ! -f "backend/.env" ]; then
        print_warning "Backend .env file not found"
        print_status "Please create backend/.env with required variables"
    fi
    
    if [ ! -f "frontend/.env" ]; then
        print_warning "Frontend .env file not found"
        print_status "Please create frontend/.env with required variables"
    fi
}

# Start the deployment process
echo ""
check_env_files
main_menu

print_success "Deployment script completed!"