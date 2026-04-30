// AI Event Planner - Feature Testing Script
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 AI Event Planner - Feature Testing');
console.log('=====================================\n');

// Test 1: Server Health Check
async function testServerHealth() {
  try {
    console.log('1️⃣ Testing Server Health...');
    
    // Test if server is responding
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body to test va