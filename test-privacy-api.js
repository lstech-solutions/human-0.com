#!/usr/bin/env node

// Test the privacy API directly
const https = require('https');

function testAPI() {
  console.log('🧪 Testing privacy API endpoint...\n');
  
  const options = {
    hostname: 'api.human0.me',
    port: 443,
    path: '/api/privacy?locale=en',
    method: 'GET',
    headers: {
      'User-Agent': 'test-script'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nResponse body:');
      console.log(data.substring(0, 500) + (data.length > 500 ? '...' : ''));
      console.log('\n✅ API test completed');
    });
  });

  req.on('error', (err) => {
    console.error('❌ Request error:', err.message);
  });

  req.end();
}

testAPI();
