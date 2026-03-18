// Test script for Gemini API
import dotenv from 'dotenv';
dotenv.config();

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Testing Gemini API Configuration...\n');
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    console.log('📝 Please add your Gemini API key to backend/.env');
    console.log('   Get your free key from: https://makersuite.google.com/app/apikey\n');
    return;
  }
  
  if (apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('❌ Please replace YOUR_GEMINI_API_KEY_HERE with your actual API key');
    console.log('📝 Get your free key from: https://makersuite.google.com/app/apikey\n');
    return;
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
  console.log('🔄 Testing API connection...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello! Please respond with "Gemini API is working!" if you can read this.'
            }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', response.status);
      console.error('   Message:', errorData.error?.message || 'Unknown error');
      console.log('\n📝 Troubleshooting:');
      console.log('   1. Check your API key at: https://makersuite.google.com/app/apikey');
      console.log('   2. Make sure the API key is active');
      console.log('   3. Verify there are no extra spaces in the .env file\n');
      return;
    }
    
    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('📝 AI Response:', aiResponse);
    console.log('\n🎉 Your chatbot is ready to use Gemini AI!');
    console.log('   Restart your server to apply the changes.\n');
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('\n📝 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify the API key is correct');
    console.log('   3. Try again in a few moments\n');
  }
}

testGeminiAPI();
