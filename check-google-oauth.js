#!/usr/bin/env node

/**
 * Google OAuth Configuration Checker
 * Run this to verify your setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Google OAuth Configuration...\n');

// Check frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  const clientId = frontendEnv.match(/VITE_GOOGLE_CLIENT_ID=(.+)/)?.[1];
  
  if (clientId && clientId !== '111111111111-placeholder.apps.googleusercontent.com') {
    console.log('✅ Frontend: Google Client ID configured');
    console.log(`   Client ID: ${clientId}`);
  } else {
    console.log('❌ Frontend: Google Client ID not configured or using placeholder');
  }
} else {
  console.log('❌ Frontend: .env file not found');
}

// Check backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  const clientSecret = backendEnv.match(/GOOGLE_CLIENT_SECRET=(.+)/)?.[1];
  const frontendUrl = backendEnv.match(/FRONTEND_URL=(.+)/)?.[1];
  
  if (clientSecret && clientSecret !== 'your_google_client_secret_here') {
    console.log('✅ Backend: Google Client Secret configured');
  } else {
    console.log('❌ Backend: Google Client Secret not configured');
  }
  
  if (frontendUrl) {
    console.log(`✅ Backend: Frontend URL set to ${frontendUrl}`);
  } else {
    console.log('❌ Backend: Frontend URL not configured');
  }
} else {
  console.log('❌ Backend: .env file not found');
}

// Check if @react-oauth/google is installed
const frontendPackageJsonPath = path.join(__dirname, 'frontend', 'package.json');
if (fs.existsSync(frontendPackageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));
  if (packageJson.dependencies['@react-oauth/google']) {
    console.log(`✅ Frontend: @react-oauth/google installed (v${packageJson.dependencies['@react-oauth/google']})`);
  } else {
    console.log('❌ Frontend: @react-oauth/google not installed');
  }
}

console.log('\n📋 Next Steps:\n');
console.log('1. Go to https://console.cloud.google.com/apis/credentials');
console.log('2. Add these URIs to your OAuth 2.0 Client:');
console.log('   - Authorized JavaScript origins: http://localhost:5173');
console.log('   - Authorized redirect URIs: http://localhost:5173');
console.log('3. Wait 5-10 minutes for changes to propagate');
console.log('4. Test at: http://localhost:5173/test-google');
console.log('\n✨ Good luck!\n');
