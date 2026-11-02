// API Automated Integration Test Suite with Real Database Verification
const http = require('http');

const PORT = 5002; // test port
process.env.PORT = String(PORT);
process.env.NODE_ENV = 'test';

const app = require('./dist/index').default;

const server = app.listen(PORT, async () => {
  console.log(`[Test Server] Running on http://localhost:${PORT}`);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = body ? JSON.stringify(body) : null;
      if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path,
          method,
          headers,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = data ? JSON.parse(data) : {};
              resolve({ status: res.statusCode, body: json });
            } catch (e) {
              resolve({ status: res.statusCode, body: data });
            }
          });
        }
      );

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  try {
    console.log('\n--- 1. Testing Health & Categories Endpoints ---');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'healthy', 'GET /api/health returns healthy');

    const categories = await request('GET', '/api/categories');
    assert(categories.status === 200 && Array.isArray(categories.body) && categories.body.length === 7, 'GET /api/categories returns 7 real categories');

    console.log('\n--- 2. Testing Real User Registration & Login ---');
    const testEmail = `user_${Date.now()}@example.org`;
    const regRes = await request('POST', '/api/auth/register', {
      email: testEmail,
      password: 'password123',
      full_name: 'Alex Rivera',
      role: 'user',
      location: 'Campus North Hall',
      phone: '+1 555-0199',
    });
    assert(regRes.status === 201 && Boolean(regRes.body.token), 'POST /api/auth/register registers real user');
    const userToken = regRes.body.token;

    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'password123',
    });
    assert(loginRes.status === 200 && loginRes.body.user.email === testEmail, 'POST /api/auth/login authenticates real user');

    const profileRes = await request('GET', '/api/auth/profile', null, userToken);
    assert(profileRes.status === 200 && profileRes.body.full_name === 'Alex Rivera', 'GET /api/auth/profile retrieves real registered profile');

    console.log('\n--- 3. Testing Real Assistance Request Lifecycle ---');
    const newReq = await request(
      'POST',
      '/api/requests',
      {
        title: 'Need organic chemistry lab notebook and model kit',
        description: 'Enrolled in Chem 201. Need model kit for molecular geometry assignments this semester.',
        category_id: categories.body[0].id,
        urgency: 'medium',
        location: 'Science Building Room 410',
        contact_info: testEmail,
      },
      userToken
    );
    assert(newReq.status === 201 && Boolean(newReq.body.request.id), 'POST /api/requests persists real request');
    const createdRequestId = newReq.body.request.id;

    console.log('\n--- 4. Testing Real Volunteer Helper Registration & Assistance Offer ---');
    const volunteerEmail = `volunteer_${Date.now()}@example.org`;
    const regVol = await request('POST', '/api/auth/register', {
      email: volunteerEmail,
      password: 'password123',
      full_name: 'Jordan Taylor',
      role: 'volunteer',
      location: 'Downtown District',
    });
    const volunteerToken = regVol.body.token;

    const offer = await request(
      'POST',
      `/api/responses/request/${createdRequestId}`,
      {
        message: 'I took Chem 201 last term and still have the complete molecular model kit! Happy to loan it to you.',
        contact_phone: '+1 555-0245',
      },
      volunteerToken
    );
    assert(offer.status === 201 && Boolean(offer.body.response.id), 'POST /api/responses/request/:id submits real assistance offer');

    const fetchedReq = await request('GET', `/api/requests/${createdRequestId}`);
    assert(
      fetchedReq.status === 200 &&
        Array.isArray(fetchedReq.body.responses) &&
        fetchedReq.body.responses.length === 1,
      'GET /api/requests/:id includes real persisted responses'
    );

    console.log('\n--- 5. Testing Real Metrics & Dashboard Telemetry ---');
    const impact = await request('GET', '/api/dashboard/impact');
    assert(impact.status === 200 && impact.body.totalRequests >= 1, 'GET /api/dashboard/impact reflects real persistent counts');

    const dashboard = await request('GET', '/api/dashboard/user', null, userToken);
    assert(dashboard.status === 200 && dashboard.body.myRequests.length === 1, 'GET /api/dashboard/user returns real user activity');

    console.log(`\n========================================`);
    console.log(`REAL IMPLEMENTATION TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    server.close(() => {
      process.exit(failed === 0 ? 0 : 1);
    });
  } catch (err) {
    console.error('Test execution error:', err);
    server.close(() => process.exit(1));
  }
});
