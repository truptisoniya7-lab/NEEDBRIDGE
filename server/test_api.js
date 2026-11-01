// API Automated Integration Test Suite
const http = require('http');

const PORT = 5001; // test port
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
    console.log('\n--- 1. Testing Health & Public Endpoints ---');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'healthy', 'GET /api/health returns healthy');

    const categories = await request('GET', '/api/categories');
    assert(categories.status === 200 && Array.isArray(categories.body) && categories.body.length > 0, 'GET /api/categories returns category array');

    const impact = await request('GET', '/api/dashboard/impact');
    assert(impact.status === 200 && typeof impact.body.totalRequests === 'number', 'GET /api/dashboard/impact returns metrics');

    const requests = await request('GET', '/api/requests');
    assert(requests.status === 200 && Array.isArray(requests.body) && requests.body.length > 0, 'GET /api/requests returns seed requests');

    console.log('\n--- 2. Testing Authentication ---');
    const loginSarah = await request('POST', '/api/auth/login', {
      email: 'sarah.c@community.org',
      password: 'password123',
    });
    assert(loginSarah.status === 200 && Boolean(loginSarah.body.token), 'POST /api/auth/login logs in Sarah Chen');
    const sarahToken = loginSarah.body.token;

    const sarahProfile = await request('GET', '/api/auth/profile', null, sarahToken);
    assert(sarahProfile.status === 200 && sarahProfile.body.email === 'sarah.c@community.org', 'GET /api/auth/profile retrieves authenticated user');

    console.log('\n--- 3. Testing Assistance Request Lifecycle ---');
    const newReq = await request(
      'POST',
      '/api/requests',
      {
        title: 'Need graphing calculator for Calculus II final exam',
        description: 'TI-84 or similar calculator needed for next Tuesday exam.',
        category_id: categories.body[0].id,
        urgency: 'high',
        location: 'Science Complex Room 310',
        contact_info: 'sarah.c@community.org',
      },
      sarahToken
    );
    assert(newReq.status === 201 && Boolean(newReq.body.request.id), 'POST /api/requests creates new request');
    const createdRequestId = newReq.body.request.id;

    console.log('\n--- 4. Testing Volunteer Assistance Offers ---');
    const loginMarcus = await request('POST', '/api/auth/login', {
      email: 'marcus.j@volunteer.net',
      password: 'password123',
    });
    const marcusToken = loginMarcus.body.token;

    const offer = await request(
      'POST',
      `/api/responses/request/${createdRequestId}`,
      {
        message: 'I have a TI-84 Plus in my locker you can borrow for the week!',
        contact_phone: '+1 (555) 987-6543',
      },
      marcusToken
    );
    assert(offer.status === 201 && Boolean(offer.body.response.id), 'POST /api/responses/request/:id submits offer');

    const fetchedReq = await request('GET', `/api/requests/${createdRequestId}`);
    assert(
      fetchedReq.status === 200 &&
        Array.isArray(fetchedReq.body.responses) &&
        fetchedReq.body.responses.length === 1,
      'GET /api/requests/:id includes submitted responses'
    );

    console.log('\n--- 5. Testing Dashboard Stats ---');
    const dashboard = await request('GET', '/api/dashboard/user', null, sarahToken);
    assert(dashboard.status === 200 && dashboard.body.myRequests.length > 0, 'GET /api/dashboard/user returns user dashboard data');

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    server.close(() => {
      process.exit(failed === 0 ? 0 : 1);
    });
  } catch (err) {
    console.error('Test execution error:', err);
    server.close(() => process.exit(1));
  }
});
