#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up AI Event Planner...\n');

// Install root dependencies
console.log('📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('🎨 Installing frontend dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit' 
  });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit' 
  });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Configure your environment variables in frontend/.env and backend/.env');
console.log('2. Run "npm run dev" to start the development servers');
console.log('3. Visit http://localhost:5174 for the frontend');
console.log('4. Backend API will be available at http://localhost:5000\n');