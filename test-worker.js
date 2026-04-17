// Test script for Cloudflare Worker
// Run this with: node test-worker.js

const testData = {
  category: "Test",
  payloadLabel: "Test Phrase",
  payload: "test123456789",
  time: new Date().toLocaleString(),
  ip: "127.0.0.1",
  city: "Test City",
  region: "Test State",
  country: "Test Country",
  device: "Test Device"
};

async function testWorker() {
  const workerUrl = 'https://your-worker-name.your-subdomain.workers.dev';

  try {
    console.log('Testing Cloudflare Worker...');
    console.log('URL:', workerUrl);
    console.log('Data:', JSON.stringify(testData, null, 2));

    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ Worker is working! Check your Telegram for the test message.');
    } else {
      console.log('❌ Worker returned an error. Check the response above.');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testWorker();